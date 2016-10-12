import { normalize } from 'normalizr';
import fetchJSON from 'app/utils/fetchJSON';
import config from '../config';

function urlFor(resource) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  }
  return config.serverUrl + resource;
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
  method = 'get',
  headers = {},
  endpoint,
  body,
  meta,
  schema
}) {
  return (dispatch, getState) => {
    const options = {
      method,
      body,
      headers
    };

    const jwt = getState().auth.token;
    if (jwt) {
      options.headers.Authorization = `JWT ${jwt}`;
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
