import { omit, isArray } from 'lodash-es';
import { normalize } from 'normalizr';
import { logout } from '~/redux/actions/UserActions';
import { selectIsLoggedIn } from '~/redux/slices/auth';
import { setStatusCode } from '~/redux/slices/routing';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { appConfig } from '~/utils/appConfig';
import createQueryString from '~/utils/createQueryString';
import fetchJSON, { HttpError } from '~/utils/fetchJSON';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { AsyncActionType, Thunk, NormalizedApiPayload } from 'app/types';
import type { Schema } from 'normalizr';
import type { ParsedQs } from 'qs';
import type { Required } from 'utility-types';
import type { AppDispatch } from '~/redux/createStore';
import type {
  PromiseAction,
  ResolvedPromiseAction,
} from '~/redux/middlewares/promiseMiddleware';
import type {
  HttpRequestOptions,
  HttpMethod,
  HttpResponse,
} from '~/utils/fetchJSON';

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return appConfig.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }

  return appConfig.serverUrl + resource;
}

function handleError(
  error: HttpError | unknown,
  propagateError: boolean,
  loggedIn: boolean,
  dispatch: AppDispatch,
) {
  if (error instanceof HttpError && error.response) {
    const statusCode = error.response.status;

    if (statusCode === 401 && loggedIn) {
      dispatch(logout());
    }

    if (propagateError) {
      const serverRenderer = import.meta.env.SSR;

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
type ApiResponse<T> =
  T extends Array<infer E> ? MultipleApiResponse<E> : SingleApiResponse<T>;

type CallAPIMeta<ExtraMeta = Record<string, never>> = ExtraMeta & {
  queryString: string;
  query?: ParsedQs;
  paginationKey?: string;
  cursor: string;
  optimisticId?: EntityId;
  enableOptimistic: boolean;
  endpoint: string;
  body?: Record<string, unknown> | string;
  schemaKey?: string;
};
type CallAPIOptionsMeta = {
  errorMessage?: string;
  successMessage?: string;
};

type CallAPIOptions<Meta extends CallAPIOptionsMeta> = {
  types: AsyncActionType;
  endpoint: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  schema?: Schema;
  body?: Record<string, unknown> | string;
  query?: ParsedQs;
  json?: boolean;
  meta?: Meta;
  files?: (string | Blob | File)[];
  force?: boolean;
  propagateError?: boolean;
  enableOptimistic?: boolean;
  requiresAuthentication?: boolean;
  timeout?: number;
  pagination?: {
    fetchNext: boolean;
  };
};

export default function callAPI<
  T = unknown,
  Meta extends CallAPIOptionsMeta = CallAPIOptionsMeta &
    Record<string, unknown>,
>(
  props: Required<CallAPIOptions<Meta>, 'schema'>,
): Thunk<
  Promise<ResolvedPromiseAction<NormalizedApiPayload<T>, CallAPIMeta<Meta>>>
>;
export default function callAPI<
  T = unknown,
  Meta extends CallAPIOptionsMeta = CallAPIOptionsMeta &
    Record<string, unknown>,
>(
  props: Omit<CallAPIOptions<Meta>, 'schema'>,
): Thunk<Promise<ResolvedPromiseAction<T, CallAPIMeta<Meta>>>>;
export default function callAPI<
  T = unknown,
  Meta extends CallAPIOptionsMeta = CallAPIOptionsMeta &
    Record<string, unknown>,
>({
  types,
  method = 'GET',
  headers = {},
  json = true,
  endpoint,
  body,
  query,
  files,
  meta = {} as Meta,
  schema,
  pagination,
  propagateError = false,
  enableOptimistic = false,
  requiresAuthentication = true,
  timeout,
}: CallAPIOptions<Meta>): Thunk<
  Promise<ResolvedPromiseAction<T | NormalizedApiPayload<T>, CallAPIMeta<Meta>>>
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
          },
    ): NormalizedApiPayload<T> | T {
      const jsonData = response.jsonData;

      if (!jsonData) {
        // This should only happen when T is void
        return {} as T;
      }

      const payload =
        isArray(schema) && 'results' in jsonData ? jsonData.results : jsonData;
      const next = 'next' in jsonData && jsonData.next ? jsonData.next : null;
      const previous =
        'previous' in jsonData && jsonData.previous ? jsonData.previous : null;
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
    let schemaKey: string | undefined = undefined;

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
        ? (paginationForRequest.pagination.next.cursor as string)
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
      requestOptions,
    );

    const action: PromiseAction<
      T | NormalizedApiPayload<T>,
      CallAPIMeta<Meta>
    > = {
      types,
      payload: optimisticPayload,
      meta: {
        queryString: qsWithoutPagination,
        query,
        paginationKey:
          paginationForRequest && paginationForRequest.paginationKey,
        cursor,
        ...meta,
        optimisticId: optimisticPayload ? optimisticPayload.result : undefined,
        enableOptimistic,
        endpoint,
        body,
        schemaKey,
      },
      promise: promise
        .then((response) =>
          normalizeJsonResponse(response as HttpResponse<ApiResponse<T>>),
        )
        .catch((error) => {
          throw handleError(error, propagateError, loggedIn, dispatch);
        }),
    };

    return dispatch(action);
  };
}
