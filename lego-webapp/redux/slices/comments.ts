import { createSlice, AnyAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Comment as CommentAT } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { parseContentTarget } from '~/utils/contentTarget';
import { addReactionCases } from './reactions';
import type {
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type { Comment as CommentType } from '~/redux/models/Comment';
import type { RootState } from '~/redux/rootReducer';

export const addCommentCases = (
  forTargetType: EntityType,
  addCase: ActionReducerMapBuilder<
    EntityState<{ comments?: EntityId[] }, EntityId>
  >['addCase'],
) => {
  const addCommentToTarget = (
    state: EntityState<{ comments?: EntityId[] }, EntityId>,
    meta: {
      contentTarget: any;
      id: any;
    },
  ) => {
    const { targetType, targetId } = parseContentTarget(meta.contentTarget);

    if (targetType === forTargetType) {
      const target = state.entities[targetId];
      if (target) {
        target.comments ??= [];
        if (!target.comments.includes(meta.id)) target.comments.push(meta.id);
      }
    }
  };

  addCase(CommentAT.SOCKET_ADD.SUCCESS, (state, action: AnyAction) =>
    addCommentToTarget(state, {
      contentTarget: action.payload.contentTarget,
      id: action.payload.id,
    }),
  );

  addCase(CommentAT.ADD.SUCCESS, (state, action: AnyAction) =>
    addCommentToTarget(state, {
      contentTarget: action.meta.contentTarget,
      id: action.payload.result,
    }),
  );
};

const nullifyComment = (state: EntityState<CommentType, EntityId>, id: any) => {
  const comment = state.entities[id];
  if (comment) {
    comment.text = null;
    comment.author = null;
  }
};

const legoAdapter = createLegoAdapter(EntityType.Comments);

const commentSlice = createSlice({
  name: EntityType.Comments,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addReactionCases(EntityType.Comments, addCase);

      addCase(CommentAT.SOCKET_ADD.SUCCESS, (state, action: AnyAction) => {
        state.entities[action.payload.id] = action.payload;
      });

      addCase(CommentAT.SOCKET_DELETE.SUCCESS, (state, action: AnyAction) =>
        nullifyComment(state, action.payload.id),
      );

      addCase(CommentAT.DELETE.SUCCESS, (state, action: AnyAction) =>
        nullifyComment(state, action.meta.id),
      );
    },
  }),
});

export default commentSlice.reducer;
export const { selectEntities: selectCommentEntities } =
  legoAdapter.getSelectors((state: RootState) => state.comments);

export const selectCommentsByIds = createSelector(
  selectCommentEntities,
  (_: RootState, ids: EntityId[] = []) => ids,
  (entities, ids) => ids.map((id) => entities[id]),
);
