import { createEntityAdapter } from '@reduxjs/toolkit';
import buildActionGrantReducer from 'app/utils/legoAdapter/buildActionGrantReducer';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import type { EntityAdapter } from '@reduxjs/toolkit';
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

// Type of the generated adapter-object
interface LegoAdapter<Entity, Id extends EntityId>
  extends EntityAdapter<Entity, Id> {
  getInitialState(): LegoEntityState<Entity, Id>;
  getInitialState<S extends object>(state: S): LegoEntityState<Entity, Id> & S;
  buildReducers(options?: {
    extraCases?: (addCase: ReducerBuilder<Entity, Id>['addCase']) => void;
    extraMatchers?: (
      addMatcher: ReducerBuilder<Entity, Id>['addMatcher']
    ) => void;
    defaultCaseReducer?: Parameters<
      ReducerBuilder<Entity, Id>['addDefaultCase']
    >[0];
    fetchActions?: AsyncActionType[];
    deleteActions?: AsyncActionType[];
  }): (builder: ReducerBuilder<Entity, Id>) => void;
}

// Helpers
type ReducerBuilder<Entity, Id extends EntityId> = ActionReducerMapBuilder<
  NoInfer<LegoEntityState<Entity, Id>>
>;
type LegoAdapterOptions<T, Id extends EntityId> = EntityAdapterOptions<T, Id>;

// function type overrides mirror the createEntityAdapter function
function createLegoAdapter<
  Type extends EntityType,
  Id extends EntityId,
  Entity extends Entities[Type][Id] = Entities[Type][Id]
>(
  entityType: Type,
  options: WithRequiredProp<LegoAdapterOptions<Type, Id>, 'selectId'>
): LegoAdapter<Entity, Id>;

function createLegoAdapter<
  Type extends EntityType,
  Entity extends Entities[Type][EntityId] & {
    id: EntityId;
  } = Entities[Type][EntityId]
>(
  entityType: Type,
  options?: Omit<EntityAdapterOptions<Entity, Entity['id']>, 'selectId'>
): LegoAdapter<Entity, Entity['id']>;

function createLegoAdapter<
  Type extends EntityType,
  Id extends EntityId,
  Entity extends Entities[Type][Id] = Entities[Type][Id]
>(
  entityType: Type,
  options: LegoAdapterOptions<Entity, EntityId> = {}
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
  };
}

export default createLegoAdapter;
