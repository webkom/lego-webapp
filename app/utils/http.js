import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import config from '../config';

function urlFor(resource) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  }
  return config.serverUrl + resource;
}

/**
 *
 */
export function createQueryString(query: {[id:string]: string|number}): string {
  const queryString = Object.keys(query)
    .filter((key) => typeof query[key] === 'number' || !!query[key])
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
}

/**
 *
 */
export function fetchJSON(path, options = {}) {
  if (typeof options.body === 'object' && options.json !== false) {
    options.body = JSON.stringify(options.body);
  }

  const request = new Request(path, {
    ...options,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...options.headers
    })
  });

  console.log('HTTP Request', request);

  return fetch(request).then((response) =>
    response.json().then((json) => {
      response.jsonData = json;
      return response;
    })
  ).then((response) => {
    if (response.ok) {
      return response;
    }

    const error = new Error(`${response.status} ${response.statusText}`);
    error.response = response;
    throw error;
  });
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
export function callAPI({
  types,
  method = 'get',
  headers,
  endpoint,
  body,
  meta,
  schema
}) {
  return (dispatch, getState) => {
    const options = {
      method,
      body
    };

    const jwt = getState().auth.token;
    if (jwt) {
      options.headers = {
        'Authorization': `JWT ${jwt}`
      };
    }

    function normalizeJsonResponse(jsonResponse = {}) {
      const { results } = jsonResponse;
      const payload = Array.isArray(results) ? results : jsonResponse;
      return schema ? normalize(payload, schema) : payload;
    }

    const optimisticId = (Date.now() * Math.random() * 1000) | 0;
    const optimisticPayload = body
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
        optimisticId: body ? optimisticId : undefined,
        body
      },
      promise: fetchJSON(urlFor(endpoint), options)
        .then((response) => normalizeJsonResponse(response.jsonData))
    });
  };
}
