import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createAppAsyncThunk } from 'app/store/hooks';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RequestThunk } from 'app/actions/FrontpageActions';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { GetState } from 'app/types';

export enum RequestStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export type RequestState<T = unknown, E = unknown> = {
  id: string;
  loading: boolean;
  ttl: number; // Time to live in milliseconds before the request may be re-fetched
  fetchTime?: number; // The time the request was fetched
  data?: T;
  error?: E;
  isPending: boolean;
  isSuccess: boolean;
  isFailure: boolean;
} & (
  | {
      status: RequestStatus.PENDING;
      isPending: true;
      isSuccess: false;
      isFailure: false;
    }
  | {
      status: RequestStatus.SUCCESS;
      isPending: false;
      isSuccess: true;
      isFailure: false;
      data: T;
      fetchTime: number;
    }
  | {
      status: RequestStatus.FAILURE;
      isPending: false;
      isSuccess: false;
      isFailure: true;
      error: E;
    }
);

const defaultRequestState = (id: string): RequestState => ({
  id,
  loading: false,
  status: RequestStatus.PENDING,
  isPending: true,
  isSuccess: false,
  isFailure: false,
  ttl: 10_000, // 10 seconds
});

type RequestActionPayload = {
  id: string; // Typically the url with query params
  ttl?: number;
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {} as Record<string, RequestState>,
  reducers: {
    requestStarted(state, action: PayloadAction<RequestActionPayload>) {
      state[action.payload.id] ??= defaultRequestState(action.payload.id);
      state[action.payload.id] = {
        ...state[action.payload.id],
        loading: true,
        ttl: action.payload.ttl ?? state[action.payload.id].ttl,
      };
    },
    requestSucceeded(
      state,
      action: PayloadAction<RequestActionPayload & { data: unknown }>,
    ) {
      state[action.payload.id] = {
        ...state[action.payload.id],
        loading: false,
        status: RequestStatus.SUCCESS,
        isPending: false,
        isSuccess: true,
        isFailure: false,
        data: action.payload.data,
        error: undefined,
        fetchTime: moment().valueOf(),
      };
    },
    requestFailed(
      state,
      action: PayloadAction<RequestActionPayload & { error: unknown }>,
    ) {
      state[action.payload.id] = {
        ...state[action.payload.id],
        isPending: false,
        isSuccess: false,
        isFailure: true,
        loading: false,
        status: RequestStatus.FAILURE,
        error: action.payload.error,
      };
    },
  },
});

export default requestsSlice.reducer;
export const { requestStarted, requestSucceeded, requestFailed } =
  requestsSlice.actions;

export const selectRequest = <T = unknown, E = unknown>(
  state: RootState,
  id: string,
) => (state.requests[id] ?? defaultRequestState(id)) as RequestState<T, E>;

/**
 * Helper functions for using the request slice
 */
export const shouldUseCachedResult = <T>(
  request: RequestState<T>,
): request is RequestState<T> & { status: RequestStatus.SUCCESS } =>
  request.status === RequestStatus.SUCCESS &&
  request.fetchTime > moment().valueOf() - request.ttl;

export const executeRequest = async <T, E = unknown>(
  id: string,
  requestFunction: () => Promise<T>,
  { dispatch, getState }: { dispatch: AppDispatch; getState: GetState },
  { ttl }: { ttl?: number } = {},
): Promise<RequestState<T, E>> => {
  const getRequest = () => selectRequest<T, E>(getState(), id);
  let request = getRequest();
  if (shouldUseCachedResult(request)) {
    return request;
  }
  if (request.loading) {
    // spin while waiting for the request to finish
    do {
      await new Promise((resolve) => setTimeout(resolve, 100));
      request = getRequest();
    } while (request.loading);

    return request;
  }

  dispatch(requestStarted({ id, ttl }));
  try {
    const data = await requestFunction();
    dispatch(requestSucceeded({ id, data }));
  } catch (error) {
    if (error instanceof Error) {
      error = `${error.name}: ${error.message}`;
    }
    dispatch(requestFailed({ id, error }));
  }
  return getRequest();
};

/**
 * Helper for creating a thunk executing a request with useful functions added to the thunk object
 */
export const createRequestThunk = <Returned, ThunkArg = void>(
  typePrefix: Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[0],
  createRequestId: (arg: ThunkArg) => string,
  payloadCreator: (
    requestId: string,
    ...args: Parameters<
      Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[1]
    >
  ) => ReturnType<
    Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[1]
  >,
  thunkOptions?: Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[2],
): RequestThunk<Returned, ThunkArg> => {
  return Object.assign(
    createAppAsyncThunk(
      typePrefix,
      (arg, thunkAPI) => payloadCreator(createRequestId(arg), arg, thunkAPI),
      thunkOptions,
    ),
    {
      createRequestId,
    },
  );
};
