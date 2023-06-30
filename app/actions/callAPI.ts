import { omit, isArray } from 'lodash';
import { normalize } from 'normalizr';
import { logout } from 'app/actions/UserActions';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectPaginationNext } from 'app/reducers/selectors';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { AsyncActionType, Thunk } from 'app/types';
import createQueryString from 'app/utils/createQueryString';
import type {
  HttpRequestOptions,
  HttpMethod,
  HttpResponse,
} from 'app/utils/fetchJSON';
import fetchJSON from 'app/utils/fetchJSON';
import { configWithSSR } from '../config';
import { setStatusCode } from './RoutingActions';
import type { Schema } from 'normalizr';

export type ApiActionResultPayload = {
  actionGrant: string[];
  entities: Partial<Entities>;
  result: ID[];
  next: null; // TODO
  previous: null; // TODO
};

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return configWithSSR.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }

  return configWithSSR.serverUrl + resource;
}

// Todo: Middleware
function handleError(error, propagateError, endpoint, loggedIn): Thunk<any> {
  return (dispatch) => {
    const statusCode = error.response && error.response.status;

    if (statusCode) {
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

    throw error;
  };
}

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
  files?: Array<any>;
  force?: boolean;
  propagateError?: boolean;
  enableOptimistic?: boolean;
  requiresAuthentication?: boolean;
  timeout?: number;
  pagination?: {
    fetchNext: boolean;
  };
};

export default function callAPI({
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
}: CallAPIOptions): Thunk<Promise<any>> {
  return (dispatch, getState) => {
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
        | HttpResponse<any>
        | {
            jsonData: Record<string, any>;
          }
    ): any {
      const jsonData = response.jsonData;

      if (!jsonData) {
        return [];
      }

      const { results, actionGrant, next, previous } = jsonData;
      const payload = Array.isArray(results) ? results : jsonData;

      if (schema) {
        return { ...normalize(payload, schema), actionGrant, next, previous };
      }

      return payload;
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
    const promise: Promise<HttpResponse<any>> = fetchJSON(
      urlFor(`${endpoint}${qs}`),
      requestOptions
    );
    return dispatch({
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
        .then((response) => normalizeJsonResponse(response))
        .catch((error) =>
          dispatch(handleError(error, propagateError, endpoint, loggedIn))
        ),
    });
  };
}
