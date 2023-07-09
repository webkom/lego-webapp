import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { Comment } from 'app/actions/ActionTypes';
import type { ID } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';
import type { Comment as CommentType } from 'app/store/models/Comment';
import { EntityType } from 'app/store/models/entities';
import { parseContentTarget } from 'app/store/utils/contentTarget';
import { type EntityReducerState } from 'app/utils/createEntityReducer';
import getEntityType from 'app/utils/getEntityType';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { EntityId } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { AnyAction } from 'redux';

type WithComments<T> = T & { comments: CommentType[] };

type StateWithComments<T, S> = S & {
  byId: Record<ID, WithComments<T>>;
};

/**
 * Used by the individual entity reducers
 */
export function mutateComments<T, S = EntityReducerState<T>>(
  forTargetType: string
) {
  return produce((newState: StateWithComments<T, S>, action: AnyAction) => {
    switch (action.type) {
      case Comment.ADD.SUCCESS: {
        const [serverTargetType, targetId] =
          action.meta.contentTarget.split('-');
        const targetType = getEntityType(serverTargetType);

        if (targetType === forTargetType) {
          newState.byId[targetId].comments =
            newState.byId[targetId].comments || [];
          newState.byId[targetId].comments.push(action.payload.result);
        }

        break;
      }

      default:
        break;
    }
  });
}

export const addCommentCases = (
  forTargetType: EntityType,
  addCase: ActionReducerMapBuilder<
    EntityState<{ comments?: EntityId[] }>
  >['addCase']
) => {
  addCase(Comment.ADD.SUCCESS, (state, action: AnyAction) => {
    const { targetType, targetId } = parseContentTarget(
      action.meta.contentTarget
    );

    if (targetType === forTargetType) {
      const entity = state.entities[targetId];
      if (entity) {
        entity.comments ??= [];
        entity.comments.push(action.payload.result);
      }
    }
  });
};

const legoAdapter = createLegoAdapter(EntityType.Comments);

const commentSlice = createSlice({
  name: EntityType.Comments,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers((builder) => {
    builder.addCase(Comment.DELETE.SUCCESS, (state, action: AnyAction) => {
      const comment = state.entities[action.meta.id];
      if (comment) {
        comment.text = null;
        comment.author = null;
      }
    });
  }),
});

export default commentSlice.reducer;
export const { selectEntities: selectCommentEntities } =
  legoAdapter.getSelectors((state: RootState) => state.comments);
