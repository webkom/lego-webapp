// @flow

import 'isomorphic-fetch';

class HttpError extends Error {
  response: Response;
}

type HttpResponse<T> = {
  jsonData?: T,
  textString?: string
} & Response;

type HttpRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: { [key: string]: string },
  body?: null | string | { [key: string]: string },
  json?: boolean,
  files?: Array<string>,
  timeout?: number,
  retryDelays?: Array<number>
};

function parseResponseBody<T>(response: HttpResponse<T>) {
  return response.text().then(textString => {
    const contentType =
      response.headers.get('content-type') || 'application/json';

    if (contentType.includes('application/json') && textString) {
      response.jsonData = (JSON.parse(textString): T);
    }

    response.textString = textString;
    return response;
  });
}

function rejectOnHttpErrors(response: HttpResponse<*>) {
  if (response.ok) {
    return response;
  }

  const error = new HttpError(`HTTP ${response.status}`);
  error.response = response;
  throw error;
}

export function stringifyBody(requestOptions: HttpRequestOptions) {
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

  if (rawBody && typeof rawBody === 'object') {
    const object = rawBody;
    Object.keys(object).forEach(prop => {
      body.append(prop, object[prop]);
    });
  }

  body.append('file', files[0]);
  return body;
}

function timeoutPromise(ms = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  }).then(() => {
    throw new Error('HTTP request timed out.');
  });
}

const defaultOptions = {
  files: [],
  retryDelays: [1000, 3000],
  timeout: 15000,
  headers: {}
};

export default function fetchJSON<T>(
  path: string,
  requestOptions: HttpRequestOptions = defaultOptions
): Promise<HttpResponse<T>> {
  const { files } = requestOptions;
  let body;
  if (files && files.length > 0) {
    body = makeFormData(files, requestOptions.body);
  } else {
    body = stringifyBody(requestOptions);
    requestOptions.headers['Content-Type'] = 'application/json';
  }

  const createRequest = () =>
    new Request(path, {
      ...requestOptions,
      body,
      headers: new Headers({
        Accept: 'application/json',
        ...requestOptions.headers
      })
    });

  return new Promise((resolve, reject) => {
    let requestsAttempted = 0;

    const wrappedFetch = () => {
      const request = createRequest();
      requestsAttempted++;
      return Promise.race([
        timeoutPromise(requestOptions.timeout),
        fetch(request)
          .then(parseResponseBody)
          .then(rejectOnHttpErrors)
          .then(resolve)
      ]).catch((error: HttpError) => {
        if (
          (error.response && error.response.status < 500) ||
          !requestOptions.retryDelays ||
          requestsAttempted > requestOptions.retryDelays.length ||
          !__CLIENT__
        ) {
          return reject(error);
        }

        setTimeout(
          wrappedFetch,
          requestOptions.retryDelays[requestsAttempted - 1]
        );
      });
    };

    return wrappedFetch();
  });
}
