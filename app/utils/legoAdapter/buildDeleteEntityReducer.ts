import type { AsyncActionType } from 'app/types';
import type { BaseMeta } from 'app/utils/legoAdapter/legacyAsyncActions';
import {
  isAsyncActionBegin,
  isAsyncActionFailure,
  isAsyncActionSuccess,
} from 'app/utils/legoAdapter/legacyAsyncActions';
import type { EntityId } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

interface DeleteActionMeta extends BaseMeta {
  id: EntityId;
}

/**
 * Handles optimistic and actual deletion of entities
 */
const buildDeleteEntityReducer = (
  builder: ActionReducerMapBuilder<EntityState<unknown>>,
  deleteActions: AsyncActionType[]
) => {
  builder.addMatcher(
    isAsyncActionBegin.matching<DeleteActionMeta>(deleteActions),
    (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.meta.id);
    }
  );
  builder.addMatcher(
    isAsyncActionFailure.matching<DeleteActionMeta>(deleteActions),
    (state, action) => {
      state.ids.push(action.meta.id);
    }
  );
  builder.addMatcher(
    isAsyncActionSuccess.matching<DeleteActionMeta>(deleteActions),
    (state, action) => {
      delete state.entities[action.meta.id];
    }
  );
};

export default buildDeleteEntityReducer;
