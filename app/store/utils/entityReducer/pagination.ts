import type { AnyAction } from '@reduxjs/toolkit';
import { EntityReducerTypes } from 'app/utils/createEntityReducer';
import {
  EntityReducerState,
  toArray,
} from 'app/store/utils/entityReducer/index';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import {
  ApiBeginAction,
  ApiSuccessAction,
  isApiPendingAction,
  isApiSuccessAction,
} from 'app/store/utils/apiActionTypes';
import { parsePaginationNextQuery } from 'app/store/utils/parseQuery';

const addPaginationReducer = <State extends EntityReducerState<unknown>>(
  builder: ActionReducerMapBuilder<State>,
  fetchTypes: EntityReducerTypes
) => {
  builder
    .addMatcher(
      (action: AnyAction): action is ApiBeginAction =>
        isApiPendingAction(action) &&
        toArray(fetchTypes).some(
          (fetchType) => action.type === fetchType.BEGIN
        ) &&
        action.meta.paginationKey &&
        action.meta.cursor === '',
      (state, action) => {
        const { paginationKey, query } = action.meta;

        state.paginationNext[paginationKey] = {
          ...state.paginationNext[paginationKey],
          items: [],
          hasMore: true,
          query,
          hasMoreBackwards: false,
          next: { ...query, cursor: '' },
          previous: null,
        };
      }
    )
    .addMatcher(
      (action: AnyAction): action is ApiSuccessAction =>
        isApiSuccessAction(action) &&
        toArray(fetchTypes).some(
          (fetchType) => action.type === fetchType.SUCCESS
        ) &&
        action.payload &&
        action.payload.next !== undefined,
      (state, action) => {
        const { paginationKey, query } = action.meta;
        const { next = null, previous = null } = action.payload;

        const parsedNext = next && parsePaginationNextQuery(next.split('?')[1]);
        const parsedPrevious =
          previous && parsePaginationNextQuery(previous.split('?')[1]);
        const hasMore = typeof next === 'string';
        const hasMoreBackwards = typeof previous === 'string';

        state.hasMore = hasMore;
        if (paginationKey) {
          state.paginationNext[paginationKey] = {
            items: [],
            ...state.paginationNext[paginationKey],
            query,
            next: parsedNext,
            previous: parsedPrevious,
            hasMore,
            hasMoreBackwards,
          };
        } else {
          state.pagination.next = parsedNext;
        }
      }
    );
};

export default addPaginationReducer;
