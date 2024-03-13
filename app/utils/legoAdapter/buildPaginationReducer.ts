import { parse } from 'qs';
import {
  isAsyncApiActionBegin,
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

interface Query {
  [key: string]: string;
}

export type Pagination = {
  query: ParsedQs;
  ids: EntityId[];
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

const createInitialPagination = (query: Query) => ({
  query,
  ids: [],
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
      state.paginationNext[action.meta.paginationKey ?? ''] ??=
        createInitialPagination(action.meta.query ?? {});
    },
  );
  builder.addMatcher(
    isAsyncApiActionSuccess.matching<FetchMeta, FetchPayload>(actionTypes),
    (state, action) => {
      state.paginationNext[action.meta.paginationKey ?? ''] ??=
        createInitialPagination(action.meta.query ?? {});
      const paginationNext =
        state.paginationNext[action.meta.paginationKey ?? ''];

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
