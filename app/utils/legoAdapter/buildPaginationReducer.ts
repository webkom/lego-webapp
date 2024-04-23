import { parse } from 'qs';
import {
  isAsyncApiActionBegin,
  isAsyncApiActionFailure,
  isAsyncApiActionSuccess,
} from 'app/utils/legoAdapter/asyncApiActions';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { AsyncActionType } from 'app/types';
import type {
  FetchMeta,
  FetchPayload,
} from 'app/utils/legoAdapter/asyncApiActions';
import type { ParsedQs } from 'qs';

export type Pagination<Id extends EntityId = EntityId> = {
  query: ParsedQs;
  ids: Id[];
  fetching: boolean;
  hasMore: boolean;
  hasMoreBackwards: boolean;
  next?: ParsedQs;
  previous?: ParsedQs;
};

type StateWithPagination = {
  paginationNext: {
    [key: string]: Pagination;
  };
};

export const createInitialPagination = <Id extends EntityId = EntityId>(
  query: ParsedQs,
): Pagination<Id> => ({
  query,
  ids: [],
  fetching: false,
  hasMore: false,
  hasMoreBackwards: false,
});

const buildPaginationReducer = (
  builder: ActionReducerMapBuilder<StateWithPagination>,
  actionTypes: AsyncActionType[],
) => {
  builder.addMatcher(
    isAsyncApiActionBegin.matching<FetchMeta>(actionTypes),
    (state, action) => {
      const paginationKey = action.meta.paginationKey ?? '';
      state.paginationNext[paginationKey] ??= createInitialPagination(
        action.meta.query ?? {},
      );
      state.paginationNext[paginationKey].fetching = true;
    },
  );
  builder.addMatcher(
    isAsyncApiActionFailure.matching<FetchMeta>(actionTypes),
    (state, action) => {
      const paginationKey = action.meta.paginationKey ?? '';
      state.paginationNext[paginationKey] ??= createInitialPagination(
        action.meta.query ?? {},
      );
      state.paginationNext[paginationKey].fetching = false;
    },
  );
  builder.addMatcher(
    isAsyncApiActionSuccess.matching<FetchMeta, FetchPayload>(actionTypes),
    (state, action) => {
      const paginationKey = action.meta.paginationKey ?? '';
      state.paginationNext[paginationKey] ??= createInitialPagination(
        action.meta.query ?? {},
      );
      const paginationNext = state.paginationNext[paginationKey];
      paginationNext.fetching = false;

      paginationNext.ids = [
        ...new Set(paginationNext.ids.concat(action.payload.result ?? [])),
      ];

      if (action.payload.next) {
        paginationNext.hasMore = true;
        paginationNext.next = parse(action.payload.next.split('?')[1]);
      } else {
        paginationNext.hasMore = false;
        paginationNext.next = undefined;
      }
      if (action.payload.previous) {
        paginationNext.hasMoreBackwards = true;
        paginationNext.previous = parse(action.payload.previous.split('?')[1]);
      } else {
        paginationNext.hasMoreBackwards = false;
        paginationNext.previous = undefined;
      }
    },
  );
};

export default buildPaginationReducer;
