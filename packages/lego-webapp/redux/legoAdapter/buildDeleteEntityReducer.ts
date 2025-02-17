import { isAsyncApiActionSuccess } from '~/redux/legoAdapter/asyncApiActions';
import type {
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type { DeleteMeta } from '~/redux/legoAdapter/asyncApiActions';
import { AsyncActionType } from '../ActionTypes';

/**
 * Handles optimistic and actual deletion of entities
 */
const buildDeleteEntityReducer = (
  builder: ActionReducerMapBuilder<EntityState<unknown, EntityId>>,
  deleteActions: AsyncActionType[],
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.matching<DeleteMeta>(deleteActions),
    (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.meta.id);
      delete state.entities[action.meta.id];
    },
  );
};

export default buildDeleteEntityReducer;
