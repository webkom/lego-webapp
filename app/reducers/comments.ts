import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { addComment, deleteComment } from 'app/actions/CommentActions';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import { EntityType } from 'app/store/models/Entities';
import { splitContentTarget } from 'app/store/utils/contentTarget';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';
import getEntityType from 'app/utils/getEntityType';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

export interface CommentEntity extends Comment {
  children: Comment[];
}

export type CommentsState = EntityReducerState<Comment>;

const initialState: CommentsState = getInitialEntityReducerState();

const commentsSlice = createSlice({
  name: EntityType.Comments,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteComment.success, (state, action) => {
      state.byId[action.meta.id].text = null;
      state.byId[action.meta.id].author = null;
    });

    addEntityReducer(builder, EntityType.Comments, {});
  },
});

export default commentsSlice.reducer;

interface EntityWithComments {
  comments?: ID[];
}

/**
 * Used by the individual entity reducers
 */
export const addMutateCommentsReducer = (
  builder: ActionReducerMapBuilder<EntityReducerState<EntityWithComments>>,
  forTargetType: EntityType
) => {
  builder.addMatcher(addComment.success.match, (state, action) => {
    const { targetType, targetId } = splitContentTarget(
      action.meta.contentTarget
    );

    if (targetType === forTargetType) {
      state.byId[targetId].comments ??= [];
      state.byId[targetId].comments.push(action.payload.result);
    }
  });
};

// TODO: remove when no longer used
type State = any;
export function mutateComments(forTargetType: string) {
  return produce<State>((newState: State, action: any): void => {
    switch (action.type) {
      case addComment.success: {
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
