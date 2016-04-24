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
    response.json().then((json) => ({ json, response }))
  ).then(({ json, response }) => {
    if (response.ok) {
      return { json, response };
    }

    const error = new Error(`${response.status} ${response.statusText}`);
    error.response = response;
    error.json = json;
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
 *   types: [Post.FETCH_BEGIN, Post.FETCH_SUCCESS, Post.FETCH_FAILURE]
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

    function _normalize(payload) {
      return schema ? normalize(payload, schema) : payload;
    }

    return dispatch({
      types,
      payload: body ? _normalize(body) : null,
      meta: {
        ...meta,
        body
      },
      promise: fetchJSON(urlFor(endpoint), options)
        .then(({ json, response }) => ({
          response,
          json: _normalize(json)
        }))
    });
  };
}
