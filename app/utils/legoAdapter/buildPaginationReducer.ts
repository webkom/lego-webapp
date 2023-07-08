import { parse } from 'qs';
import type { AsyncActionType } from 'app/types';
import type {
  FetchMeta,
  FetchPayload,
} from 'app/utils/legoAdapter/legacyAsyncActions';
import {
  isAsyncActionBegin,
  isAsyncActionSuccess,
} from 'app/utils/legoAdapter/legacyAsyncActions';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
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
  pagination: {
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
  actionTypes: AsyncActionType[]
) => {
  builder.addMatcher(
    isAsyncActionBegin.matching<FetchMeta>(actionTypes),
    (state, action) => {
      state.pagination[action.meta.paginationKey ?? ''] ??=
        createInitialPagination(action.meta.query ?? {});
    }
  );
  builder.addMatcher(
    isAsyncActionSuccess.matching<FetchMeta, FetchPayload>(actionTypes),
    (state, action) => {
      state.pagination[action.meta.paginationKey ?? ''] ??=
        createInitialPagination(action.meta.query ?? {});
      const pagination = state.pagination[action.meta.paginationKey ?? ''];

      pagination.ids = pagination.ids.concat(action.payload.result ?? []);

      if (action.payload.next) {
        pagination.hasMore = true;
        pagination.next = parse(action.payload.next.split('?')[1]);
      }
      if (action.payload.previous) {
        pagination.hasMoreBackwards = true;
        pagination.previous = parse(action.payload.previous.split('?')[1]);
      }
    }
  );
};

export default buildPaginationReducer;
