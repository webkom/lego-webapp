import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import { EntityReducerTypes } from 'app/utils/createEntityReducer';
import addFetchingReducer from 'app/store/utils/entityReducer/fetching';
import { AsyncActionType } from 'app/types';
import { isArray } from 'lodash';
import addPaginationReducer from 'app/store/utils/entityReducer/pagination';
import addCreateAndUpdateEntitiesReducer from 'app/store/utils/entityReducer/createAndUpdateEntities';

export const toArray = (value: EntityReducerTypes): AsyncActionType[] =>
  isArray(value) ? value : [value];

type Pagination = {
  next: {
    cursor: string;
  } | null;
} & Record<
  Exclude<string, 'next'>,
  {
    queryString: string;
    nextPage: string | null;
  }
>;

interface PaginationNext<ID> {
  [key: string]: {
    items: ID[];
    hasMore: boolean;
    hasMoreBackwards: boolean;
    query?: Record<string, string>;
    next: {
      cursor: string;
    } | null;
    previous: {
      cursor: string;
    } | null;
  };
}

export interface EntityReducerState<
  Entity,
  ID extends string | number = string | number,
  ActionGrant = string
> {
  actionGrant: ActionGrant[];
  pagination: Pagination;
  paginationNext: PaginationNext<ID>;
  byId: {
    [key in ID]?: Entity;
  };
  items: ID[];
  hasMore: boolean;
  fetching: boolean;
}

export const getInitialEntityReducerState = <
  Entity,
  ID extends string | number,
  ActionGrant
>(): EntityReducerState<Entity, ID, ActionGrant> => ({
  actionGrant: [],
  pagination: {},
  paginationNext: {},
  byId: {},
  items: [],
  hasMore: false,
  fetching: false,
});

const addEntityReducer = <State extends EntityReducerState<unknown>>(
  builder: ActionReducerMapBuilder<State>,
  key: string,
  types: {
    fetch?: EntityReducerTypes;
    mutate?: EntityReducerTypes;
    delete?: EntityReducerTypes;
  }
): void => {
  const { fetch: fetchTypes, delete: deleteTypes, mutate: mutateTypes } = types;
  fetchTypes && addFetchingReducer(builder, fetchTypes);
  fetchTypes && addPaginationReducer(builder, fetchTypes);
  fetchTypes && addCreateAndUpdateEntitiesReducer(builder, fetchTypes, key);
};

export default addEntityReducer;
