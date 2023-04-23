import 'isomorphic-fetch';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export class HttpError extends Error {
  response: Response | undefined;
}
export type HttpResponse<T> = {
  jsonData?: T | typeof undefined;
  textString?: string;
} & Response;
export type HttpRequestOptions = {
  method?: HttpMethod;
  headers: Record<string, string>;
  body?: Record<string, any> | string;
  json?: boolean;
  files?: Array<string>;
  timeout?: number;
  retryDelays?: Array<number>;
};

function parseResponseBody<T>(response: Response): Promise<HttpResponse<T>> {
  return response.text().then((textString) => {
    const newResponse: HttpResponse<T> = response;
    const contentType =
      response.headers.get('content-type') || 'application/json';

    if (contentType.includes('application/json') && textString) {
      newResponse.jsonData = JSON.parse(textString) as T;
    }

    newResponse.textString = textString;
    return newResponse;
  });
}

function rejectOnHttpErrors(response: HttpResponse<any>) {
  if (response.ok) {
    return response;
  }

  const error = new HttpError(`HTTP ${response.status}`);
  error.response = response;
  throw error;
}

export function stringifyBody(
  requestOptions: HttpRequestOptions
): string | null | undefined {
  const { body, json } = requestOptions;

  if (typeof body === 'string') {
    return body;
  }

  if (typeof body === 'object' && json !== false) {
    return JSON.stringify(body);
  }

  return;
}

function makeFormData(files, rawBody) {
  const body = new FormData();

  if (rawBody && typeof rawBody === 'object') {
    const object: Record<string, string> = rawBody;
    Object.keys(object).forEach((prop) => {
      body.append(prop, object[prop]);
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

const defaultOptions = {
  files: [],
  headers: {},
};
export default function fetchJSON<T>(
  path: string,
  requestOptions: HttpRequestOptions = defaultOptions
): Promise<HttpResponse<T>> {
  const { files, retryDelays = [1000, 3000], timeout = 15000 } = requestOptions;
  let body;

  if (files && files.length > 0) {
    body = makeFormData(files, requestOptions.body);
  } else if (requestOptions.body) {
    body = stringifyBody(requestOptions);
    requestOptions.headers['Content-Type'] = 'application/json';
  }

  const createRequest = () =>
    new Request(path, {
      ...requestOptions,
      body,
      headers: new Headers({
        Accept: 'application/json',
        ...(requestOptions.headers as Record<string, any>),
      }),
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
          .then(resolve),
      ]).catch((error: HttpError) => {
        if (
          (error.response && error.response.status < 500) ||
          !retryDelays ||
          requestsAttempted > retryDelays.length ||
          !__CLIENT__
        ) {
          return reject(error);
        }

        setTimeout(wrappedFetch, retryDelays[requestsAttempted - 1]);
      });
    };

    return wrappedFetch();
  });
}
