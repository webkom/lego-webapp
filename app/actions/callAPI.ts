import { omit, isArray } from 'lodash';
import { normalize } from 'normalizr';
import { logout } from 'app/actions/UserActions';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectPaginationNext } from 'app/reducers/selectors';
import createQueryString from 'app/utils/createQueryString';
import fetchJSON, { HttpError } from 'app/utils/fetchJSON';
import { configWithSSR } from '../config';
import { setStatusCode } from './RoutingActions';
import type { ActionGrant } from 'app/models';
import type { AppDispatch } from 'app/store/createStore';
import type {
  PromiseAction,
  RejectedPromiseAction,
  ResolvedPromiseAction,
} from 'app/store/middleware/promiseMiddleware';
import type { AsyncActionType, Thunk, NormalizedApiPayload } from 'app/types';
import type {
  HttpRequestOptions,
  HttpMethod,
  HttpResponse,
} from 'app/utils/fetchJSON';
import type { Schema } from 'normalizr';
import type { Required } from 'utility-types';

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return configWithSSR.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }

  return configWithSSR.serverUrl + resource;
}

function handleError(
  error: HttpError | unknown,
  propagateError: boolean,
  loggedIn: boolean,
  dispatch: AppDispatch
) {
  if (error instanceof HttpError && error.response) {
    const statusCode = error.response.status;

    if (statusCode === 401 && loggedIn) {
      dispatch(logout());
    }

    if (propagateError) {
      const serverRenderer = !__CLIENT__;

      if ((serverRenderer && statusCode < 500) || !serverRenderer) {
        dispatch(setStatusCode(statusCode));
      }
    }
  }

  return error;
}

type MultipleApiResponse<E> = {
  results: E[];
  actionGrant?: ActionGrant;
  next?: string | null;
  previous?: string | null;
};
type SingleApiResponse<E> = E & {
  actionGrant?: ActionGrant;
};
type ApiResponse<T> = T extends Array<infer E>
  ? MultipleApiResponse<E>
  : SingleApiResponse<T>;

type CallAPIOptions = {
  types: AsyncActionType;
  endpoint: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  schema?: Schema;
  body?: Record<string, any> | string;
  query?: Record<string, string | number | boolean>;
  json?: boolean;
  meta?: Record<string, unknown>;
  files?: string[];
  force?: boolean;
  propagateError?: boolean;
  enableOptimistic?: boolean;
  requiresAuthentication?: boolean;
  timeout?: number;
  pagination?: {
    fetchNext: boolean;
  };
};

export default function callAPI<T = void>(
  props: Required<CallAPIOptions, 'schema'>
): Thunk<
  Promise<
    RejectedPromiseAction | ResolvedPromiseAction<NormalizedApiPayload<T>>
  >
>;
export default function callAPI<T = void>(
  props: Omit<CallAPIOptions, 'schema'>
): Thunk<Promise<RejectedPromiseAction | ResolvedPromiseAction<T>>>;
export default function callAPI<T = void>({
  types,
  method = 'GET',
  headers = {},
  json = true,
  endpoint,
  body,
  query,
  files,
  meta,
  schema,
  pagination,
  propagateError = false,
  enableOptimistic = false,
  requiresAuthentication = true,
  timeout,
}: CallAPIOptions): Thunk<
  Promise<
    RejectedPromiseAction | ResolvedPromiseAction<T | NormalizedApiPayload<T>>
  >
> {
  return async (dispatch: AppDispatch, getState) => {
    const requestOptions: HttpRequestOptions = {
      method,
      body,
      files,
      headers: headers || {},
      json,
      timeout,
    };

    const state = getState();
    const loggedIn = selectIsLoggedIn(state);
    const jwt = state.auth.token;

    if (jwt && requiresAuthentication) {
      requestOptions.headers.Authorization = `Bearer ${jwt}`;
    }

    function normalizeJsonResponse(
      response:
        | HttpResponse<ApiResponse<T>>
        | {
            jsonData: ApiResponse<T>;
          }
    ): NormalizedApiPayload<T> | T {
      const jsonData = response.jsonData;

      if (!jsonData) {
        return {};
      }

      const payload = 'results' in jsonData ? jsonData.results : jsonData;
      const next =
        'next' in jsonData && jsonData.next ? jsonData.next : undefined;
      const previous =
        'previous' in jsonData && jsonData.previous
          ? jsonData.previous
          : undefined;
      const actionGrant = jsonData.actionGrant;

      if (schema) {
        return {
          ...normalize(payload, schema),
          actionGrant,
          next,
          previous,
        } as NormalizedApiPayload<T>;
      }

      return payload as T;
    }

    // @todo: better id gen (cuid or something)
    const optimisticId = Math.floor(Date.now() * Math.random() * 1000);
    const optimisticPayload =
      enableOptimistic && body && typeof body === 'object'
        ? normalizeJsonResponse({
            jsonData: {
              id: optimisticId,
              __persisted: false,
              ...body,
            },
          })
        : null;
    const qsWithoutPagination = query
      ? createQueryString(omit(query, 'cursor'))
      : '';
    let schemaKey = null;

    if (schema) {
      if (isArray(schema)) {
        schemaKey = schema[0].key;
      } else {
        schemaKey = schema.key;
      }
    }

    const paginationForRequest =
      pagination &&
      schemaKey &&
      selectPaginationNext({
        endpoint,
        query: query || {},
        schema,
      })(state);
    const cursor =
      pagination &&
      pagination.fetchNext &&
      paginationForRequest &&
      paginationForRequest.pagination &&
      paginationForRequest.pagination.next
        ? paginationForRequest.pagination.next.cursor
        : '';

    const qs =
      query || cursor
        ? createQueryString({
            cursor,
            ...query,
          })
        : '';

    const promise: Promise<HttpResponse<unknown>> = fetchJSON(
      urlFor(`${endpoint}${qs}`),
      requestOptions
    );

    const action: PromiseAction<T | NormalizedApiPayload<T>> = {
      types,
      payload: optimisticPayload,
      meta: {
        queryString: qsWithoutPagination,
        query,
        paginationKey:
          paginationForRequest && paginationForRequest.paginationKey,
        cursor,
        ...(meta as Record<string, any>),
        optimisticId: optimisticPayload ? optimisticPayload.result : undefined,
        enableOptimistic,
        endpoint,
        body,
        schemaKey,
      },
      promise: promise
        .then((response) =>
          normalizeJsonResponse(response as HttpResponse<ApiResponse<T>>)
        )
        .catch((error) => {
          throw handleError(error, propagateError, loggedIn, dispatch);
        }),
    };

    return dispatch(action);
  };
}
