import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import {
  isLegoApiBeginAction,
  isLegoApiFailureAction,
  LegoApiBeginAction,
  LegoApiFailureAction,
  LegoApiThunkAction,
} from 'app/store/utils/createLegoApiAction';
import {
  EntityReducerState,
  toArray,
} from 'app/store/utils/entityReducer/index';
import type { Action } from '@reduxjs/toolkit';

const addOptimisticDeleteReducer = <State extends EntityReducerState<unknown>>(
  builder: ActionReducerMapBuilder<State>,
  deleteTypes: LegoApiThunkAction | LegoApiThunkAction[]
) => {
  builder
    .addMatcher(
      (action: Action): action is LegoApiBeginAction =>
        isLegoApiBeginAction(action) &&
        toArray(deleteTypes).some(
          (deleteType) => deleteType.begin.type === action.type
        ) &&
        action.meta.enableOptimistic,
      (state, action) => {
        state.items = state.items.filter((item) => item !== action.meta.id);
      }
    )
    .addMatcher(
      (action: Action): action is LegoApiFailureAction =>
        isLegoApiFailureAction(action) &&
        toArray(deleteTypes).some(
          (deleteType) => deleteType.failure.type === action.type
        ) &&
        action.meta.enableOptimistic,
      (state, action) => {
        state.items = state.items.concat(action.meta.id);
      }
    );
};

export default addOptimisticDeleteReducer;
