import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'app/actions/createApiThunk/handleError';
import {
  createApiThunkMeta,
  getValue,
  urlFor,
} from 'app/actions/createApiThunk/utils';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { addToast } from 'app/reducers/toasts';
import createQueryString from 'app/utils/createQueryString';
import fetchJSON from 'app/utils/fetchJSON';
import type { ValueOrCreator } from 'app/actions/createApiThunk/utils';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { Query } from 'app/utils/createQueryString';
import type { HttpRequestOptions } from 'app/utils/fetchJSON';
import type { schema } from 'normalizr';
import type { Primitive } from 'utility-types';

export const IS_API_ACTION = Symbol('isApiAction');
export type ApiThunkActionCreator<
  Arg = unknown,
  ExtraMeta extends object | Primitive = object | Primitive,
  Payload = unknown,
> = ReturnType<typeof createApiThunk<Arg, ExtraMeta, Payload>>;

type CreateApiThunkOptions<Meta> = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  json?: boolean;
  body?: Record<string, unknown> | string;
  files?: (string | File)[];
  timeout?: number;
  query?: Query;
  schema?: schema.Entity | schema.Entity[];
  requiresAuthentication?: boolean;
  propagateError?: boolean;
  errorMessage?: string;
  successMessage?: string;
  extraMeta?: Meta;
  nextPage?: boolean;
};
type ApiThunkMeta<Extra> = {
  extra: Extra;
  paginationKey?: string;
  [IS_API_ACTION]: true;
};
const createApiThunk = <
  Arg = undefined,
  ExtraMeta extends object | Primitive = object | Primitive,
  Payload = unknown,
>(
  typePrefix: string,
  options: ValueOrCreator<CreateApiThunkOptions<ExtraMeta>, Arg>,
  payloadCreator: (apiPayload: unknown, arg: Arg) => Payload,
) =>
  createAsyncThunk<
    Payload,
    Arg,
    {
      state: RootState;
      dispatch: AppDispatch;
      pendingMeta: ApiThunkMeta<ExtraMeta>;
      fulfilledMeta: ApiThunkMeta<ExtraMeta>;
      rejectedMeta: ApiThunkMeta<ExtraMeta>;
    }
  >(
    typePrefix,
    async (
      arg: Arg,
      { getState, dispatch, fulfillWithValue, rejectWithValue },
    ) => {
      const {
        endpoint,
        method = 'GET',
        headers = {},
        json = true,
        body,
        files,
        timeout,
        query,
        requiresAuthentication = true,
        propagateError = false,
        errorMessage,
        successMessage,
        extraMeta,
      } = getValue(options, arg);

      const requestOptions: HttpRequestOptions = {
        method,
        headers,
        json,
        body,
        files,
        timeout,
      };

      const state = getState();
      const loggedIn = selectIsLoggedIn(state);
      const jwt = state.auth.token;

      if (jwt && requiresAuthentication) {
        requestOptions.headers.Authorization = `Bearer ${jwt}`;
      }

      const queryString = createQueryString(query);

      try {
        const response = await fetchJSON(
          urlFor(endpoint + queryString),
          requestOptions,
        );

        if (successMessage) {
          addToast({ message: successMessage });
        }
        return fulfillWithValue(
          payloadCreator(response.jsonData, arg),
          createApiThunkMeta(endpoint, query, extraMeta!),
        );
      } catch (error: unknown) {
        if (errorMessage) {
          addToast({ message: errorMessage });
        }
        return rejectWithValue(
          handleError(error, propagateError, loggedIn, dispatch),
          createApiThunkMeta(endpoint, query, extraMeta!),
        );
      }
    },
    {
      getPendingMeta: ({ arg }) => {
        const { endpoint, query, extraMeta } = getValue(options, arg);
        return createApiThunkMeta(endpoint, query, extraMeta!);
      },
    },
  );

export default createApiThunk;
