import { createEntityAdapter } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { isNotNullish } from 'app/utils';
import buildActionGrantReducer from 'app/utils/legoAdapter/buildActionGrantReducer';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import type { EntityAdapter, EntitySelectors } from '@reduxjs/toolkit';
import type {
  EntityAdapterOptions,
  EntityId,
  EntityState,
} from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { NoInfer, WithRequiredProp } from '@reduxjs/toolkit/src/tsHelpers';
import type { ActionGrant } from 'app/models';
import type { EntityType } from 'app/store/models/entities';
import type Entities from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';

// The base redux-state of the entity-slice
interface LegoEntityState<Entity, Id extends EntityId>
  extends EntityState<Entity, Id> {
  actionGrant: ActionGrant;
  fetching: boolean;
  paginationNext: { [key: string]: Pagination };
}

interface LegoEntitySelectors<T, V, Id extends EntityId>
  extends EntitySelectors<T, V, Id> {
  selectAllPaginated: (state: V, options?: { pagination?: Pagination }) => T[];
  selectByField: <K extends keyof T, Value = T[K]>(
    field: K,
    predicate?: (entityValue: T[K], filterValue: Value) => boolean,
  ) => ((state: V, filterValue: Value) => T[]) & {
    single: (state: V, filterValue: Value) => T | undefined;
  };
}

// Type of the generated adapter-object
interface LegoAdapter<Entity, Id extends EntityId>
  extends EntityAdapter<Entity, Id> {
  getInitialState(): LegoEntityState<Entity, Id>;
  getInitialState<S extends object>(state: S): LegoEntityState<Entity, Id> & S;
  buildReducers<ExtraState extends object = Record<string, never>>(options?: {
    extraCases?: (
      addCase: ReducerBuilder<Entity, Id, ExtraState>['addCase'],
    ) => void;
    extraMatchers?: (
      addMatcher: ReducerBuilder<Entity, Id, ExtraState>['addMatcher'],
    ) => void;
    defaultCaseReducer?: Parameters<
      ReducerBuilder<Entity, Id, ExtraState>['addDefaultCase']
    >[0];
    fetchActions?: AsyncActionType[];
    deleteActions?: AsyncActionType[];
  }): (builder: ReducerBuilder<Entity, Id, ExtraState>) => void;
  getSelectors(): LegoEntitySelectors<Entity, EntityState<Entity, Id>, Id>;
  getSelectors<V>(
    selectState: (state: V) => EntityState<Entity, Id>,
  ): LegoEntitySelectors<Entity, V, Id>;
}

// Helpers
type ReducerBuilder<
  Entity,
  Id extends EntityId,
  ExtraState extends object,
> = ActionReducerMapBuilder<NoInfer<LegoEntityState<Entity, Id>> & ExtraState>;
type LegoAdapterOptions<T, Id extends EntityId> = EntityAdapterOptions<T, Id>;

// function type overrides mirror the createEntityAdapter function
function createLegoAdapter<
  Type extends EntityType,
  Id extends EntityId,
  Entity extends Entities[Type][Id] = Entities[Type][Id],
>(
  entityType: Type,
  options: WithRequiredProp<LegoAdapterOptions<Entity, Id>, 'selectId'>,
): LegoAdapter<Entity, Id>;

function createLegoAdapter<
  Type extends EntityType,
  Entity extends Entities[Type][EntityId] & {
    id: EntityId;
  } = Entities[Type][EntityId],
>(
  entityType: Type,
  options?: Omit<LegoAdapterOptions<Entity, Entity['id']>, 'selectId'>,
): LegoAdapter<Entity, Entity['id']>;

function createLegoAdapter<
  Type extends EntityType,
  Id extends EntityId,
  Entity extends Entities[Type][Id] = Entities[Type][Id],
>(
  entityType: Type,
  options: LegoAdapterOptions<Entity, EntityId> = {},
): LegoAdapter<Entity, Id> {
  const entityAdapter = createEntityAdapter<Entity>(options);

  return {
    ...entityAdapter,
    getInitialState(extraState = {}) {
      return {
        ...entityAdapter.getInitialState(),
        actionGrant: [],
        fetching: false,
        paginationNext: {},
        ...extraState,
      };
    },
    buildReducers({
      extraCases,
      extraMatchers,
      defaultCaseReducer,
      fetchActions = [],
      deleteActions = [],
    } = {}) {
      return (builder) => {
        extraCases?.(builder.addCase);

        buildFetchingReducer(builder, fetchActions);
        buildEntitiesReducer(builder, entityAdapter, entityType);
        buildActionGrantReducer(builder, entityType);
        buildDeleteEntityReducer(builder, deleteActions);
        buildPaginationReducer(builder, fetchActions);

        extraMatchers?.(builder.addMatcher);

        if (defaultCaseReducer) {
          builder.addDefaultCase(defaultCaseReducer);
        }
      };
    },
    getSelectors<V>(selectState?: (state: V) => EntityState<Entity, Id>) {
      const selectors = selectState
        ? entityAdapter.getSelectors<V>(selectState)
        : entityAdapter.getSelectors();
      return {
        ...selectors,
        selectAllPaginated: createSelector(
          selectors.selectEntities,
          selectors.selectIds,
          (_: V, { pagination }: { pagination?: Pagination } = {}) =>
            pagination,
          (entities, allIds, pagination) => {
            const ids = pagination ? pagination.ids || [] : allIds;
            return ids.map((id) => entities[id]).filter(isNotNullish);
          },
        ),
        selectByField: <K extends keyof Entity, Value = Entity[K]>(
          field: K,
          predicate: (entityValue: Entity[K], filterValue: Value) => boolean = (
            entityValue,
            filterValue,
          ) => entityValue === filterValue,
        ) => {
          const selector = createSelector(
            selectors.selectAll,
            (_: V, value: Value) => value,
            (entities, value) =>
              entities.filter((entity) => predicate(entity[field], value)),
          );
          return Object.assign(selector, {
            single: createSelector(selector, (entities) => entities[0]),
          });
        },
      };
    },
  };
}

export default createLegoAdapter;
