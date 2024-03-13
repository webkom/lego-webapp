import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { EntityType } from 'app/store/models/entities';

interface StateWithActionGrant {
  actionGrant: string[];
}

const buildActionGrantReducer = (
  builder: ActionReducerMapBuilder<StateWithActionGrant>,
  entityType: EntityType
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.withSchemaKey(entityType),
    (state, action) => {
      if (
        action.payload &&
        'actionGrant' in action.payload &&
        action.payload.actionGrant
      ) {
        state.actionGrant = action.payload.actionGrant;
      }
    }
  );
};

export default buildActionGrantReducer;
