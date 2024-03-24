import { isNotNullish } from 'app/utils';
import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type {
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import type { DeleteMeta } from 'app/utils/legoAdapter/asyncApiActions';

/**
 * Handles optimistic and actual deletion of entities
 */
const buildDeleteEntityReducer = (
  builder: ActionReducerMapBuilder<EntityState<unknown, EntityId>>,
  entityType: EntityType,
  deleteActions: AsyncActionType[],
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.matching<DeleteMeta>(deleteActions),
    (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.meta.id);
      delete state.entities[action.meta.id];
    },
  );

  builder.addMatcher(isDeleteFulfilledAction(entityType), (state, action) => {
    state.ids = state.ids.filter((id) => id !== action.meta.deleteId);
    delete state.entities[action.meta.deleteId];
  });
};

const isDeleteFulfilledAction =
  (entityType: EntityType) =>
  (
    action: UnknownAction,
  ): action is PayloadAction<
    unknown,
    string,
    { deleteId: EntityId; requestStatus: 'fulfilled' },
    unknown
  > =>
    'meta' in action &&
    typeof action.meta === 'object' &&
    isNotNullish(action.meta) &&
    'entityType' in action.meta &&
    action.meta.entityType === entityType &&
    'deleteId' in action.meta &&
    (typeof action.meta.deleteId === 'string' ||
      typeof action.meta.deleteId === 'number') &&
    'requestStatus' in action.meta &&
    action.meta.requestStatus === 'fulfilled';

export default buildDeleteEntityReducer;
