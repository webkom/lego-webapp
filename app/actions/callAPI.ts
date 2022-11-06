import type { Schema } from 'normalizr';
import { normalize } from 'normalizr';
import type {
  HttpRequestOptions,
  HttpMethod,
  HttpResponse,
} from 'app/utils/fetchJSON';
import fetchJSON from 'app/utils/fetchJSON';
import { configWithSSR } from '../config';
import { omit, isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import { logout } from 'app/actions/UserActions';
import getCachedRequest from 'app/utils/getCachedRequest';
import { setStatusCode } from 'app/store/slices/routerSlice';
import type { AsyncActionType, Thunk } from 'app/types';
import { selectIsLoggedIn } from 'app/store/slices/authSlice';
import { selectPaginationNext } from 'app/store/slices/selectorsSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

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
        // $FlowFixMe
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
  query?: Record<string, any>;
  json?: boolean;
  meta?: Record<string, unknown>;
  files?: Array<any>;
  force?: boolean;
  useCache?: boolean;
  cacheSeconds?: number;
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
  useCache,
  pagination,
  cacheSeconds = 10,
  propagateError = false,
  enableOptimistic = false,
  requiresAuthentication = true,
  timeout,
}: CallAPIOptions): Thunk<Promise<any>> {
  return (dispatch, getState) => {
    const methodUpperCase = method.toUpperCase();
    const shouldUseCache =
      typeof useCache === 'undefined' ? methodUpperCase === 'GET' : useCache;
    const requestOptions: HttpRequestOptions = {
      method,
      body,
      files,
      headers,
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

    if (shouldUseCache) {
      const cachedRequest = getCachedRequest(
        state,
        endpoint,
        paginationForRequest ? paginationForRequest.paginationKey : '',
        cursor,
        cacheSeconds
      );

      if (cachedRequest) {
        return Promise.resolve(dispatch(cachedRequest));
      }
    }

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
        success: shouldUseCache && types.SUCCESS,
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
