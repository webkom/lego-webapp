import type {
  LegoApiAction,
  LegoApiThunkAction,
} from 'app/store/utils/createLegoApiAction';
import {
  EntityReducerState,
  toArray,
} from 'app/store/utils/entityReducer/index';
import type { Action } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

interface StateWithFetching {
  fetching: boolean;
}

export const addFetchingReducer = <State extends StateWithFetching>(
  builder: ActionReducerMapBuilder<State>,
  fetchTypes: LegoApiThunkAction | LegoApiThunkAction[]
) => {
  for (const { begin, failure, success } of toArray(fetchTypes)) {
    const matchFn = (action: Action): action is LegoApiAction =>
      action.type === begin.type ||
      action.type === failure.type ||
      action.type === success.type;

    builder.addMatcher(matchFn, (state, action) => {
      state.fetching = action.type === begin.type;
    });
  }
};

export default addFetchingReducer;
