import { urlFor } from 'app/actions/callAPI';
import { executeRequest } from 'app/reducers/requests';
import { setStatusCode } from 'app/reducers/routing';
import { addToast } from 'app/reducers/toasts';
import type { RequestState } from 'app/reducers/requests';
import type { AppDispatch } from 'app/store/createStore';
import type { GetState } from 'app/types';

export type ApiFetchRequestError = {
  status: number;
  message: string;
};

export type ApiFetchRequestOptions = {
  errorMessage?: string;
  propagateError?: boolean; // default false
  requiresAuthentication?: boolean; // default true
  headers?: Record<string, string>;
};

export const apiFetchRequest = async <T = unknown>(
  endpoint: string,
  thunkAPI: { dispatch: AppDispatch; getState: GetState },
  resultTransformer: (result: unknown) => T = (result) => result as T,
  {
    errorMessage,
    propagateError,
    requiresAuthentication = true,
    headers,
  }: ApiFetchRequestOptions = {},
): Promise<RequestState<T, ApiFetchRequestError>> =>
  executeRequest(
    endpoint,
    async () => {
      headers ??= {};
      if (requiresAuthentication) {
        const token = thunkAPI.getState().auth.token;
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      const response = await fetch(urlFor(endpoint), {
        headers,
      });
      if (!response.ok) {
        handleError(
          response,
          { errorMessage, propagateError },
          thunkAPI.dispatch,
        );
        throw { status: response.status, message: response.statusText };
      }
      const json = await response.json();
      return resultTransformer(json);
    },
    thunkAPI,
  );

const handleError = (
  response: Response,
  options: Pick<ApiFetchRequestOptions, 'errorMessage' | 'propagateError'>,
  dispatch: AppDispatch,
) => {
  if (options.errorMessage) {
    dispatch(addToast({ message: options.errorMessage, type: 'error' }));
  }

  if (options.propagateError) {
    const serverRendering = !__CLIENT__;
    if ((serverRendering && response.status < 500) || !serverRendering) {
      dispatch(setStatusCode(response.status));
    }
  }
};
