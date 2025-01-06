import { normalize } from 'normalizr';
import { createRequestThunk, type RequestState } from 'app/reducers/requests';
import { apiFetchRequest } from 'app/store/utils/apiFetchRequest';
import { createFetchHook } from 'app/store/utils/createFetchHook';
import { entitiesReceived } from 'app/utils/legoAdapter/actions';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { ApiFetchRequestOptions } from 'app/store/utils/apiFetchRequest';
import type { Schema } from 'normalizr';

export const normalizeFetchResult =
  (schema: Schema, thunkAPI: { dispatch: AppDispatch }) =>
  (result: unknown) => {
    const normalized = normalize(result, schema);
    thunkAPI.dispatch(entitiesReceived(normalized.entities));
    return normalized.result;
  };

type NormalizedApiDataOptions<Arg, T> = {
  optimistic?: boolean; // if true, the result will be attempted to be selected from state before the request is made
  optimisticSelector?: (state: RootState, arg?: Arg) => T | undefined; // default is the same as selectEntityById
};

export const createNormalizedApiDataHook = <Arg, T>(
  fetchActionId: string,
  createUrl: (arg: Arg) => string,
  selectEntityById: (state: RootState, entityId?: EntityId) => T | undefined,
  schema: Schema,
  {
    optimistic = true,
    optimisticSelector = selectEntityById as (
      state: RootState,
      arg?: Arg,
    ) => T | undefined,
    ...apiFetchRequestOptions
  }: ApiFetchRequestOptions & NormalizedApiDataOptions<Arg, T> = {},
) =>
  createFetchHook(
    fetchActionId,
    createRequestThunk(
      fetchActionId,
      createUrl,
      async (url, _, thunkAPI) =>
        await apiFetchRequest<EntityId>(
          url,
          thunkAPI,
          normalizeFetchResult(schema, thunkAPI),
          apiFetchRequestOptions,
        ),
    ),
    (state, request, arg) =>
      ({
        ...request,
        data:
          request.data !== undefined
            ? selectEntityById(state, request.data) // overwrite data with selected from state with given selector
            : optimistic
              ? optimisticSelector(state, arg) // or with optimisticSelector
              : undefined,
      }) as RequestState<T>, // typecast to convince TypeScript that the selector will always return result for successful requests
  );
