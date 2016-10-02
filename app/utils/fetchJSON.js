import 'isomorphic-fetch';

/**
 *
 */
export default function fetchJSON(path, options = {}) {
  if (typeof options.body === 'object' && options.json !== false) {
    options.body = JSON.stringify(options.body);
  }

  const request = new Request(path, {
    ...options,
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    })
  });

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
