import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import { EntityReducerTypes } from 'app/utils/createEntityReducer';
import { ApiAction } from 'app/store/utils/apiActionTypes';
import type { Action } from '@reduxjs/toolkit';
import { toArray } from 'app/store/utils/entityReducer/index';

interface FetchingState {
  fetching: boolean;
}

const addFetchingReducer = <State extends FetchingState>(
  builder: ActionReducerMapBuilder<State>,
  fetchTypes: EntityReducerTypes
) => {
  for (const type of toArray(fetchTypes)) {
    const matchFn = (action: Action): action is ApiAction =>
      action.type === type.BEGIN ||
      action.type === type.FAILURE ||
      action.type === type.SUCCESS;

    builder.addMatcher(matchFn, (state, action) => {
      state.fetching = action.type === type.BEGIN;
    });
  }
};

export default addFetchingReducer;
