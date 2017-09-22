// @flow

import { normalize } from 'normalizr';
import fetchJSON from 'app/utils/fetchJSON';
import config from '../config';
import type { Thunk } from 'app/types';
import { logout } from 'app/actions/UserActions';
import isRequestNeeded from 'app/utils/isRequestNeeded';
import { setStatusCode } from './RoutingActions';

function urlFor(resource) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }
  return config.serverUrl + resource;
}

function handleError(error, propagateError, endpoint) {
  return dispatch => {
    const statusCode = error.response && error.response.status;
    if (statusCode) {
      if (statusCode === 401) {
        dispatch(logout());
      }
      if (propagateError) {
        const serverRenderer = typeof window === 'undefined';
        if ((serverRenderer && statusCode < 500) || !serverRenderer) {
          dispatch(setStatusCode(statusCode));
        }
      }
    }
    throw error;
  };
}

/**
 * Action creator for calling the API.
 *
 * It will automatically append the auth token if one exists.
 *
 * ```js
 * dispatch(callAPI({
 *   types: Post.FETCH
 *   endpoint: `/posts`
 * }))
 * ```
 */
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
  requiresAuthentication = true
}: Object): Thunk<*, *> {
  return (dispatch, getState) => {
    const methodUpperCase = method.toUpperCase();
    const shouldUseCache = methodUpperCase === 'GET' || useCache;
    const options = {
      method: methodUpperCase,
      body,
      files,
      headers,
      json
    };

    const state = getState();
    if (
      !force &&
      shouldUseCache &&
      !isRequestNeeded(state, endpoint, cacheSeconds)
    ) {
      return Promise.resolve('Request skipped');
    }

    const jwt = state.auth.token;
    if (jwt && requiresAuthentication) {
      options.headers.Authorization = `JWT ${jwt}`;
    }

    function normalizeJsonResponse(jsonResponse = {}) {
      const { results, actionGrant } = jsonResponse;
      const payload = Array.isArray(results) ? results : jsonResponse;
      return schema
        ? {
            ...normalize(payload, schema),
            actionGrant
          }
        : payload;
    }

    // @todo: better id gen (cuid or something)
    const optimisticId = Math.floor(Date.now() * Math.random() * 1000);
    const optimisticPayload =
      !disableOptimistic && body
        ? normalizeJsonResponse({
            id: optimisticId,
            __persisted: false,
            ...body
          })
        : null;

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
      promise: fetchJSON(urlFor(endpoint), options)
        .then(response => normalizeJsonResponse(response.jsonData))
        .catch(error => dispatch(handleError(error, propagateError, endpoint)))
    });
  };
}
