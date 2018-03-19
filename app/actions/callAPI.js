// @flow

import { normalize, Schema } from 'normalizr';
import fetchJSON, {
  type HttpRequestOptions,
  type HttpMethod,
  type HttpResponse
} from 'app/utils/fetchJSON';
import config from '../config';
import { isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import { logout } from 'app/actions/UserActions';
import getCachedRequest from 'app/utils/getCachedRequest';
import { setStatusCode } from './RoutingActions';
import type { AsyncActionType, Thunk } from 'app/types';
import { selectIsLoggedIn } from 'app/reducers/auth';

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }
  return config.serverUrl + resource;
}

// Todo: Middleware
function handleError(error, propagateError, endpoint, loggedIn): Thunk<*> {
  return dispatch => {
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
  types: AsyncActionType,
  endpoint: string,
  method?: HttpMethod,
  headers?: { [key: string]: string },
  schema?: Schema,
  body?: Object | string,
  query?: Object,
  json?: boolean,
  meta?: { [key: string]: mixed },
  files?: Array<any>,
  force?: boolean,
  useCache?: boolean,
  cacheSeconds?: number,
  propagateError?: boolean,
  disableOptimistic?: boolean,
  requiresAuthentication?: boolean
};

function toHttpRequestOptions(
  options: $Shape<CallAPIOptions>
): HttpRequestOptions {
  return {
    method: options.method,
    headers: options.headers || {},
    body: options.body,
    json: options.json,
    files: options.files
  };
}

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
  cacheSeconds = 10,
  propagateError = false,
  disableOptimistic = false,
  requiresAuthentication = true,
  mapper
}: CallAPIOptions): Thunk<Promise<any>> {
  return (dispatch, getState) => {
    const methodUpperCase = method.toUpperCase();
    const shouldUseCache =
      typeof useCache === 'undefined' ? methodUpperCase === 'GET' : useCache;

    const requestOptions = toHttpRequestOptions({
      method,
      body,
      files,
      headers,
      json
    });

    const state = getState();
    const loggedIn = selectIsLoggedIn(state);
    if (shouldUseCache) {
      const cachedRequest = getCachedRequest(state, endpoint, cacheSeconds);
      if (cachedRequest) {
        return Promise.resolve(dispatch(cachedRequest));
      }
    }

    const jwt = state.auth.token;
    if (jwt && requiresAuthentication) {
      requestOptions.headers.Authorization = `JWT ${jwt}`;
    }

    function normalizeJsonResponse(response: HttpResponse<*>): any {
      const jsonData = response.jsonData;

      if (!jsonData) {
        return [];
      }

      const { results, actionGrant, next } = jsonData;

      const payload = Array.isArray(results) ? results : jsonData;

      if (schema) {
        return {
          ...normalize(payload, schema),
          actionGrant,
          next
        };
      }

      return payload;
    }

    // @todo: better id gen (cuid or something)
    const optimisticId = Math.floor(Date.now() * Math.random() * 1000);
    const optimisticPayload =
      !disableOptimistic && body && typeof body === 'object'
        ? normalizeJsonResponse({
            id: optimisticId,
            __persisted: false,
            ...body
          })
        : null;

    const qs = query ? createQueryString(query) : '';

    const promise: Promise<HttpResponse<*>> = fetchJSON(
      urlFor(`${endpoint}${qs}`),
      requestOptions
    );

    let schemaKey = null;
    if (schema) {
      if (isArray(schema)) {
        schemaKey = schema[0].key;
      } else {
        schemaKey = schema.key;
      }
    }

    return dispatch({
      types,
      payload: optimisticPayload,
      meta: {
        ...meta,
        optimisticId: optimisticPayload ? optimisticId : undefined,
        endpoint,
        success: shouldUseCache && types.SUCCESS,
        body,
        schemaKey
      },
      promise: promise
        .then(response => normalizeJsonResponse(response))
        .catch(error =>
          // $FlowFixMe
          dispatch(handleError(error, propagateError, endpoint, loggedIn))
        )
    });
  };
}
