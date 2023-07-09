import { createEntityAdapter } from '@reduxjs/toolkit';
import type { ApiActionResultPayload } from 'app/actions/callAPI';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionType as LegacyAsyncActionType } from 'app/types';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import buildActionGrantReducer from 'app/utils/legoAdapter/bulidActionGrantReducer';
import type { EntityAdapter, AsyncThunk } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';

// The base redux-state of the entity-slice
interface LegoEntityState<Entity> extends EntityState<Entity> {
  actionGrant: string[];
  fetching: boolean;
  paginationNext: {
    [key: string]: Pagination;
  };
}

// Type of the generated adapter-object
interface LegoAdapter<Entity> extends EntityAdapter<Entity> {
  getInitialState(): LegoEntityState<Entity>;
  getInitialState<S extends object>(state: S): LegoEntityState<Entity> & S;
  buildReducers(
    builderCallback?: (
      builder: Omit<ReducerBuilder<Entity>, 'addDefaultCase'>
    ) => void,
    defaultCaseReducer?: Parameters<ReducerBuilder<Entity>['addDefaultCase']>[0]
  ): (builder: ReducerBuilder<Entity>) => void;
}

// Helpers
export type ReducerBuilder<Entity> = ActionReducerMapBuilder<
  NoInfer<LegoEntityState<Entity>>
>;
type AsyncActionType = LegacyAsyncActionType; // | ApiResultThunk;
type ApiResultThunk = AsyncThunk<
  ApiActionResultPayload,
  unknown,
  { state: RootState; dispatch: AppDispatch }
>;

type LegoAdapterOptions<T> = Parameters<typeof createEntityAdapter<T>>[0] & {
  fetchActions?: AsyncActionType[];
  deleteActions?: AsyncActionType[];
};

const createLegoAdapter = <
  Type extends EntityType,
  Entity extends Entities[Type][ID] = Entities[Type][ID]
>(
  entityType: Type,
  {
    fetchActions = [],
    deleteActions = [],
    ...entityAdapterOpts
  }: LegoAdapterOptions<Entity> = {}
): LegoAdapter<Entity> => {
  const entityAdapter = createEntityAdapter<Entity>(entityAdapterOpts);

  return {
    ...entityAdapter,
    getInitialState(extraState = {}) {
      return entityAdapter.getInitialState({
        actionGrant: [],
        fetching: false,
        paginationNext: {},
        ...extraState,
      });
    },
    buildReducers(builderCallback, defaultCaseReducer) {
      return (builder) => {
        builderCallback?.(builder);

        buildFetchingReducer(builder, fetchActions);
        buildEntitiesReducer(builder, entityAdapter, entityType);
        buildActionGrantReducer(builder, entityType);
        buildDeleteEntityReducer(builder, deleteActions);
        buildPaginationReducer(builder, fetchActions);

        if (defaultCaseReducer) {
          builder.addDefaultCase(defaultCaseReducer);
        }
      };
    },
  };
};

export default createLegoAdapter;
