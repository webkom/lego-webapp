/* This part of entityReducer will handle deletion of values of a given entity.
 * For actions of the type given into `types.delete` when setting up CER will be deleted.
 *
 * Make sure to set `meta.id` in the action.
 */
import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import { isNumber, omit, without } from 'lodash';
import {
  isLegoApiAction,
  LegoApiAction,
  LegoApiThunkAction,
} from 'app/store/utils/createLegoApiAction';
import { EntityReducerState, toArray } from 'app/store/utils/entityReducer';
import type { Action } from '@reduxjs/toolkit';

const addDeleteEntitiesReducer = <State extends EntityReducerState<unknown>>(
  builder: ActionReducerMapBuilder<State>,
  deleteTypes: LegoApiThunkAction | LegoApiThunkAction[]
) => {
  builder.addMatcher(
    (action: Action): action is LegoApiAction =>
      isLegoApiAction(action) &&
      toArray(deleteTypes).some(
        (deleteType) => deleteType.success.type === action.type
      ) &&
      !!action.meta.id,
    (state, action) => {
      const resultId = action.meta.id;

      const paginationNext = Object.keys(state.paginationNext).reduce(
        (newPaginationNext, key) => {
          newPaginationNext[key] = {
            ...state.paginationNext[key],
            items: without(
              state.paginationNext[key].items,
              ...(isNumber(resultId)
                ? [Number(resultId), resultId.toString()]
                : [resultId])
            ),
          };
          return newPaginationNext;
        },
        {}
      );

      state.paginationNext = paginationNext;
      state.byId = omit(state.byId, resultId);
      state.items = without(
        state.items,
        ...(isNumber(resultId)
          ? [Number(resultId), resultId.toString()]
          : [resultId])
      );
    }
  );
};

export default addDeleteEntitiesReducer;
