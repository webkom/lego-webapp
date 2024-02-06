import { createEntityAdapter } from '@reduxjs/toolkit';
import buildActionGrantReducer from 'app/utils/legoAdapter/buildActionGrantReducer';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import type { EntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/entities';
import type Entities from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';

// The base redux-state of the entity-slice
interface LegoEntityState<Entity> extends EntityState<Entity> {
  actionGrant: ActionGrant;
  fetching: boolean;
  paginationNext: { [key: string]: Pagination };
}

// Type of the generated adapter-object
interface LegoAdapter<Entity> extends EntityAdapter<Entity> {
  getInitialState(): LegoEntityState<Entity>;
  getInitialState<S extends object>(state: S): LegoEntityState<Entity> & S;
  buildReducers(options?: {
    extraCases?: (addCase: ReducerBuilder<Entity>['addCase']) => void;
    extraMatchers?: (addMatcher: ReducerBuilder<Entity>['addMatcher']) => void;
    defaultCaseReducer?: Parameters<
      ReducerBuilder<Entity>['addDefaultCase']
    >[0];
    fetchActions?: AsyncActionType[];
    deleteActions?: AsyncActionType[];
  }): (builder: ReducerBuilder<Entity>) => void;
}

// Helpers
type ReducerBuilder<Entity> = ActionReducerMapBuilder<
  NoInfer<LegoEntityState<Entity>>
>;
type LegoAdapterOptions<T> = Parameters<typeof createEntityAdapter<T>>[0];

const createLegoAdapter = <
  Type extends EntityType,
  Entity extends Entities[Type][ID] = Entities[Type][ID]
>(
  entityType: Type,
  opts: LegoAdapterOptions<Entity> = {}
): LegoAdapter<Entity> => {
  const entityAdapter = createEntityAdapter<Entity>(opts);

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
};

export default createLegoAdapter;
