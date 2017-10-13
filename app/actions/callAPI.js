// @flow

import { normalize, Schema } from 'normalizr';
import fetchJSON, {
  type HttpRequestOptions,
  type HttpMethod,
  type HttpResponse
} from 'app/utils/fetchJSON';
import config from '../config';
import { logout } from 'app/actions/UserActions';
import isRequestNeeded from 'app/utils/isRequestNeeded';
import { setStatusCode } from './RoutingActions';
import type { AsyncActionType, Action, Thunk } from 'app/types';

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }
  return config.serverUrl + resource;
}

// Todo: Middleware
function handleError(error, propagateError, endpoint): Thunk<*> {
  return dispatch => {
    const statusCode = error.response && error.response.status;
    if (statusCode) {
      if (statusCode === 401) {
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
  files,
  meta,
  schema,
  force = false,
  useCache,
  cacheSeconds = 10,
  propagateError = false,
  disableOptimistic = false,
  requiresAuthentication = true,
  mapper
}: CallAPIOptions): Thunk<Promise<?Action>> {
  return (dispatch, getState) => {
    const methodUpperCase = method.toUpperCase();
    const shouldUseCache = methodUpperCase === 'GET' || useCache;

    const requestOptions = toHttpRequestOptions({
      method,
      body,
      files,
      headers,
      json
    });

    const state = getState();
    if (
      !force &&
      shouldUseCache &&
      !isRequestNeeded(state, endpoint, cacheSeconds)
    ) {
      return Promise.resolve(null);
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

      const { results, actionGrant } = jsonData;

      const payload = Array.isArray(results) ? results : jsonData;

      if (schema) {
        return {
          ...normalize(payload, schema),
          actionGrant
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

    const promise: Promise<HttpResponse<*>> = fetchJSON(
      urlFor(endpoint),
      requestOptions
    );

    return dispatch({
      types,
      payload: optimisticPayload,
      meta: {
        ...meta,
        optimisticId: optimisticPayload ? optimisticId : undefined,
        endpoint,
        success: shouldUseCache && types.SUCCESS,
        body
      },
      promise: promise
        .then(response => normalizeJsonResponse(response))
        .catch(error => dispatch(handleError(error, propagateError, endpoint)))
    });
  };
}
