import { createEntityAdapter } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { isNotNullish } from 'app/utils';
import buildActionGrantReducer from 'app/utils/legoAdapter/buildActionGrantReducer';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import type {
  EntityAdapter,
  EntitySelectors,
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
  Comparer,
  IdSelector,
} from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { EntityType } from 'app/store/models/entities';
import type Entities from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { Assign } from 'utility-types';

export type WithRequiredProp<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// The base redux-state of the entity-slice
interface LegoEntityState<Entity, Id extends EntityId>
  extends EntityState<Entity, Id> {
  actionGrant: ActionGrant;
  fetching: boolean;
  paginationNext: { [key: string]: Pagination };
}

type LegoEntitySelectors<T, V, Id extends EntityId> = Assign<
  EntitySelectors<T, V, Id>,
  {
    selectAll: <Type extends T = T>(state: V) => Type[];
    selectEntities: <Type extends T = T>(state: V) => Record<Id, Type>;
    selectById: <Type extends T = T>(
      state: V,
      id: Id | undefined,
    ) => Type | undefined; // Overwrite the selectById method to accept undefined id
    selectByIds: <Type extends T = T>(state: V, ids?: Id[]) => Type[];
    selectAllPaginated: <Type extends T = T>(
      state: V,
      options?: { pagination?: Pagination<Id> },
    ) => Type[];
    selectByField: <K extends keyof T, Value = T[K] | T[K][]>(
      field: K,
      predicate?: (entityValue: T[K], filterValue: Value) => boolean,
    ) => (<Type extends T = T>(state: V, filterValue?: Value) => Type[]) & {
      single: <Type extends T = T>(
        state: V,
        filterValue?: Value,
      ) => Type | undefined;
    };
  }
>;

// Type of the generated adapter-object
type LegoAdapter<Entity, Id extends EntityId> = Assign<
  EntityAdapter<Entity, Id>,
  {
    getInitialState(): LegoEntityState<Entity, Id>;
    getInitialState<S extends object>(
      state: S,
    ): LegoEntityState<Entity, Id> & S;
    buildReducers<ExtraState extends object>(options?: {
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
>;

// Helpers
type ReducerBuilder<
  Entity,
  Id extends EntityId,
  ExtraState extends object,
> = ActionReducerMapBuilder<NoInfer<LegoEntityState<Entity, Id>> & ExtraState>;
type LegoAdapterOptions<T, Id extends EntityId> = {
  selectId?: IdSelector<T, Id>;
  sortComparer?: false | Comparer<T>;
};

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
    // @ts-expect-error - This won't work for entities without id, but they should provide a selectId function
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
  // @ts-expect-error - Any entity without id should provide a selectId function
  const entityAdapter = createEntityAdapter<Entity, Id>(options);

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
        selectByIds: createSelector(
          selectors.selectEntities,
          (_: V, ids: Id[] = []) => ids,
          (entities, ids) => ids.map((id) => entities[id]).filter(isNotNullish),
        ),
        selectAllPaginated: createSelector(
          selectors.selectEntities,
          selectors.selectIds,
          (_: V, { pagination }: { pagination?: Pagination<Id> } = {}) =>
            pagination,
          (entities, allIds, pagination) => {
            const ids: Id[] = pagination ? pagination.ids || [] : allIds;
            return ids.map((id) => entities[id]).filter(isNotNullish);
          },
        ),
        selectByField: <
          K extends keyof Entity,
          Value = Entity[K] | Entity[K][],
        >(
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
              entities.filter((entity) =>
                Array.isArray(value)
                  ? value.some((valueItem) =>
                      predicate(entity[field], valueItem),
                    )
                  : predicate(entity[field], value),
              ),
          );
          return Object.assign(selector, {
            single: createSelector(selector, (entities) => entities[0]),
          });
        },
      } as LegoEntitySelectors<Entity, V, Id>; // Type assertion needed because we allow type-overrides in some selectors that are not type-safe
    },
  };
}

export default createLegoAdapter;
