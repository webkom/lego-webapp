import 'isomorphic-fetch';

export function stringifyBody(requestOptions: Object) {
  const { body, json } = requestOptions;

  if (typeof body === 'string') {
    return body;
  }

  if (typeof body === 'object' && json !== false) {
    return JSON.stringify(body);
  }

  return null;
}

/**
 *
 */
export default function fetchJSON(path, options = {}) {
  const filesToUpload = options.files ? options.files : [];
  delete options.files;

  let body;
  if (filesToUpload.length > 0) {
    body = new FormData();

    const rawBody = options.body;

    if (rawBody != null) {
      Object.keys(rawBody).forEach((prop) => {
        body.append(prop, rawBody[prop]);
      });
    }

    body.append('file', filesToUpload[0]);
  } else {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    body = stringifyBody(options);
  }

  const request = new Request(path, {
    ...options,
    body,
    headers: new Headers({
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
