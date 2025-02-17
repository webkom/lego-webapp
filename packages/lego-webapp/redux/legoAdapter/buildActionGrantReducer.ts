import { isAsyncApiActionSuccess } from '~/redux/legoAdapter/asyncApiActions';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { EntityType } from '~/redux/models/entities';

interface StateWithActionGrant {
  actionGrant: string[];
}

const buildActionGrantReducer = (
  builder: ActionReducerMapBuilder<StateWithActionGrant>,
  entityType: EntityType,
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
    },
  );
};

export default buildActionGrantReducer;
