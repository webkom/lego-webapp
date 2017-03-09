import 'isomorphic-fetch';

function parseResponseBody(response) {
  return response.text().then((textString) => {
    const contentType = response.headers.get('content-type') || 'application/json';

    if (contentType.includes('application/json') && textString) {
      response.jsonData = JSON.parse(textString);
    }

    response.textString = textString;
    return response;
  });
}

function rejectOnHttpErrors(response) {
  if (response.ok) {
    return response;
  }

  const error = new Error(`HTTP ${response.status}`);
  error.response = response;
  throw error;
}

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

function makeFormData(files, rawBody) {
  const body = new FormData();

  if (rawBody) {
    Object.keys(rawBody).forEach((prop) => {
      body.append(prop, rawBody[prop]);
    });
  }

  body.append('file', files[0]);
  return body;
}

function timeoutPromise(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  }).then(() => {
    throw new Error('HTTP request timed out.');
  });
}

export default function fetchJSON(path, requestOptions = {}) {
  const {
    files = [],
    retryDelays = [1000, 3000],
    timeout = 15000,
    ...options
   } = requestOptions;

  const body = files.length > 0
    ? makeFormData(files, options.body)
    : stringifyBody(options);

  const createRequest = () => new Request(path, {
    ...options,
    body,
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    })
  });


  return new Promise((resolve, reject) => {
    let requestsAttempted = 0;

    const wrappedFetch = () => {
      const request = createRequest();
      requestsAttempted++;
      return Promise.race([
        timeoutPromise(timeout),
        fetch(request)
          .then(parseResponseBody)
          .then(rejectOnHttpErrors)
          .then(resolve)
      ])
        .catch((error) => {
          if (!retryDelays || requestsAttempted > retryDelays.length) {
            return reject(error);
          }

          setTimeout(() => {
            wrappedFetch();
          }, retryDelays[requestsAttempted - 1]);
        });
    };

    wrappedFetch();
  });
}
