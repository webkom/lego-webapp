import { urlFor } from 'app/actions/callAPI';
import { executeRequest } from 'app/reducers/requests';
import type { RequestState } from 'app/reducers/requests';
import type { AppDispatch } from 'app/store/createStore';
import type { GetState } from 'app/types';

export const apiFetchRequest = async <T = unknown>(
  endpoint: string,
  thunkAPI: { dispatch: AppDispatch; getState: GetState },
  resultTransformer: (result: unknown) => T = (result) => result as T,
): Promise<RequestState<T>> =>
  executeRequest(
    endpoint,
    async () =>
      resultTransformer(
        await fetch(urlFor(endpoint)).then((response) => response.json()),
      ),
    thunkAPI,
  );
