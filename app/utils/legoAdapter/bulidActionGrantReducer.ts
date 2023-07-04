import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionSuccess } from 'app/utils/legoAdapter/legacyAsyncActions';
import { isAsyncActionSuccess } from 'app/utils/legoAdapter/legacyAsyncActions';
import type { AnyAction } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

interface StateWithActionGrant {
  actionGrant: string[];
}

const isAsyncActionSuccessWithSchemaKey =
  (entityType: EntityType) =>
  (action: AnyAction): action is AsyncActionSuccess =>
    isAsyncActionSuccess(action) && action.meta.schemaKey === entityType;

const buildActionGrantReducer = (
  builder: ActionReducerMapBuilder<StateWithActionGrant>,
  entityType: EntityType
) => {
  builder.addMatcher(
    isAsyncActionSuccessWithSchemaKey(entityType),
    (state, action) => {
      if (action.payload.actionGrant) {
        state.actionGrant = action.payload.actionGrant;
      }
    }
  );
};

export default buildActionGrantReducer;
