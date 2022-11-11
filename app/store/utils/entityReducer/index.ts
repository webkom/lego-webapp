import { isArray } from 'lodash';
import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/Entities';
import type { LegoApiThunkAction } from 'app/store/utils/createLegoApiAction';
import addCreateAndUpdateEntitiesReducer from 'app/store/utils/entityReducer/createAndUpdateEntities';
import addDeleteEntitiesReducer from 'app/store/utils/entityReducer/deleteEntities';
import addFetchingReducer from 'app/store/utils/entityReducer/fetching';
import addOptimisticReducer from 'app/store/utils/entityReducer/optimistic';
import addOptimisticDeleteReducer from 'app/store/utils/entityReducer/optimisticDelete';
import addPaginationReducer from 'app/store/utils/entityReducer/pagination';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

export const toArray = <T>(value: T | T[]): T[] =>
  isArray(value) ? value : [value];

export type Pagination = {
  next?: {
    cursor: string;
  } | null;
} & Record<
  Exclude<string, 'next'>,
  {
    queryString: string;
    nextPage: string | null;
  }
>;

export interface PaginationNext<EntityID = ID> {
  [key: string]: {
    items: EntityID[];
    hasMore: boolean;
    hasMoreBackwards: boolean;
    query?: Record<string, string>;
    next:
      | ({
          cursor: string;
        } & Record<string, string>)
      | null;
    previous: {
      cursor: string;
    } | null;
  };
}

type DefaultActionGrant = //TODO: check if this is correct
  'delete' | 'view' | 'send' | 'list' | 'create' | 'edit';

export interface EntityReducerState<
  Entity,
  ActionGrant = DefaultActionGrant,
  EntityID extends ID = ID
> {
  actionGrant: ActionGrant[];
  pagination: Pagination;
  paginationNext: PaginationNext<EntityID>;
  byId: {
    [key in EntityID]?: Entity;
  };
  items: EntityID[];
  hasMore: boolean;
  fetching: boolean;
}

export const getInitialEntityReducerState = <
  Entity,
  ActionGrant,
  ID extends string | number
>(): EntityReducerState<Entity, ActionGrant, ID> => ({
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
  key: EntityType,
  types: {
    fetch?: LegoApiThunkAction | LegoApiThunkAction[];
    mutate?: LegoApiThunkAction | LegoApiThunkAction[];
    delete?: LegoApiThunkAction | LegoApiThunkAction[];
  },
  mutate?: (builder: ActionReducerMapBuilder<State>) => void
): void => {
  const { fetch: fetchTypes, delete: deleteTypes, mutate: mutateTypes } = types;
  fetchTypes && addFetchingReducer(builder, fetchTypes);
  fetchTypes && addPaginationReducer(builder, fetchTypes);
  addCreateAndUpdateEntitiesReducer(builder, fetchTypes, key);
  deleteTypes && addDeleteEntitiesReducer(builder, deleteTypes);
  deleteTypes && addOptimisticDeleteReducer(builder, deleteTypes);
  mutateTypes && addOptimisticReducer(builder, mutateTypes);
  mutate?.(builder);
};

export default addEntityReducer;
