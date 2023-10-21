import { createEntityAdapter } from '@reduxjs/toolkit';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import type { EntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';

// The base redux-state of the entity-slice
interface LegoEntityState<Entity> extends EntityState<Entity> {
  actionGrant: ActionGrant;
  fetching: boolean;
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
        ...extraState,
      };
    },
    buildReducers({
      extraCases,
      extraMatchers,
      defaultCaseReducer,
      fetchActions = [],
    } = {}) {
      return (builder) => {
        extraCases?.(builder.addCase);

        buildFetchingReducer(builder, fetchActions);

        extraMatchers?.(builder.addMatcher);

        if (defaultCaseReducer) {
          builder.addDefaultCase(defaultCaseReducer);
        }
      };
    },
  };
};

export default createLegoAdapter;
