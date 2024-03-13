import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { AsyncActionType } from 'app/types';
import type { DeleteMeta } from 'app/utils/legoAdapter/asyncApiActions';

/**
 * Handles optimistic and actual deletion of entities
 */
const buildDeleteEntityReducer = (
  builder: ActionReducerMapBuilder<EntityState<unknown>>,
  deleteActions: AsyncActionType[]
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.matching<DeleteMeta>(deleteActions),
    (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.meta.id);
      delete state.entities[action.meta.id];
    }
  );
};

export default buildDeleteEntityReducer;
