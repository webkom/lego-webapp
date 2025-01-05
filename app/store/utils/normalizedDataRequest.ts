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

export const createNormalizedApiDataHook = <Arg, T>(
  fetchActionId: string,
  createUrl: (arg: Arg) => string,
  selectEntityById: (state: RootState, entityId?: EntityId) => T | undefined,
  schema: Schema,
  options: ApiFetchRequestOptions = {},
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
          options,
        ),
    ),
    (state, request) =>
      ({
        ...request,
        data: selectEntityById(state, request.data), // overwrite data with selected from state with given selector
      }) as RequestState<T>, // typecast to convince TypeScript that the selector will always return result for successful requests
  );
