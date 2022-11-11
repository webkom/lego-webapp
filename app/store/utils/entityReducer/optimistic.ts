import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { ID } from 'app/store/models';
import {
  isLegoApiBeginAction,
  LegoApiBeginAction,
  LegoApiThunkAction,
} from 'app/store/utils/createLegoApiAction';
import {
  EntityReducerState,
  toArray,
} from 'app/store/utils/entityReducer/index';
import type { Action } from '@reduxjs/toolkit';

type LegoApiBeginActionWithOptimisticId = LegoApiBeginAction<
  `${string}.BEGIN`,
  { optimisticId: ID }
>;

const addOptimisticReducer = <State extends EntityReducerState<unknown>>(
  builder: ActionReducerMapBuilder<State>,
  mutateTypes: LegoApiThunkAction | LegoApiThunkAction[]
) => {
  builder.addMatcher(
    (action: Action): action is LegoApiBeginActionWithOptimisticId =>
      isLegoApiBeginAction(action) &&
      toArray(mutateTypes).some(
        (mutateType) => mutateType.begin.type === action.type
      ),
    (state, action) => {
      state.paginationNext = {};
      state.items = state.items.filter(
        (item) => item !== action.meta.optimisticId
      );
    }
  );
};

export default addOptimisticReducer;
