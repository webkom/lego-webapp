import { createEntityAdapter } from '@reduxjs/toolkit';
import type { ApiActionResultPayload } from 'app/actions/callAPI';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionType as LegacyAsyncActionType } from 'app/types';
import { isLegacyAsyncActionSuccessWithEntityType } from 'app/utils/legacyFetchActionUtils';
import type { EntityAdapter, AsyncThunk } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';

// The base redux-state of the entity-slice
interface LegoEntityState<Entity> extends EntityState<Entity> {
  actionGrant: string[]; // TODO: type it!
  fetching: boolean;
}

// Type of the generated adapter-object
interface LegoAdapter<Entity> extends EntityAdapter<Entity> {
  getInitialState(): LegoEntityState<Entity>;
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
type AsyncActionType =
  | LegacyAsyncActionType
  | AsyncThunk<
      ApiActionResultPayload,
      unknown,
      { state: RootState; dispatch: AppDispatch }
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

  const reduceLegacyAsyncActionSuccess = (state, action) => {
    const entities = action.payload.entities[entityType];
    entityAdapter.upsertMany(
      state as LegoEntityState<Entity>,
      entities as never
    );
  };

  const addFetchTypeCases = (
    builder: ReducerBuilder<Entity>,
    asyncAction: AsyncActionType
  ) => {
    const cases =
      'pending' in asyncAction
        ? asyncAction
        : ({
            pending: asyncAction.BEGIN,
            rejected: asyncAction.FAILURE,
            fulfilled: asyncAction.SUCCESS,
            // This is an ugly typecast, and we have no guarantee of correctness here, but if the actions are created
            // correctly the inferred payload should be correct
          } as unknown as AsyncThunk<ApiActionResultPayload, unknown, object>);

    builder.addCase(cases.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(cases.rejected, (state) => {
      state.fetching = false;
    });
    builder.addCase(cases.fulfilled, (state, action) => {
      state.fetching = false;
      if (action.payload.actionGrant) {
        state.actionGrant = action.payload.actionGrant;
      }
    });
  };

  return {
    ...entityAdapter,
    getInitialState() {
      return {
        ...entityAdapter.getInitialState(),
        actionGrant: [],
        fetching: false,
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

        for (const fetchAction of fetchActions) {
          addFetchTypeCases(builder, fetchAction);
        }

        builder.addMatcher(
          isLegacyAsyncActionSuccessWithEntityType<Type>(entityType),
          reduceLegacyAsyncActionSuccess
        );
        extraMatchers?.(builder.addMatcher);

        if (defaultCaseReducer) {
          builder.addDefaultCase(defaultCaseReducer);
        }
      };
    },
  };
};

export default createLegoAdapter;
