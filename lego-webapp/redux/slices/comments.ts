import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Comment } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { parseContentTarget } from '~/utils/contentTarget';
import { addReactionCases } from './reactions';
import type {
  AnyAction,
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type { RootState } from '~/redux/rootReducer';

export const addCommentCases = (
  forTargetType: EntityType,
  addCase: ActionReducerMapBuilder<
    EntityState<{ comments?: EntityId[] }, EntityId>
  >['addCase'],
) => {
  addCase(Comment.ADD.SUCCESS, (state, action: AnyAction) => {
    const { targetType, targetId } = parseContentTarget(
      action.meta.contentTarget,
    );

    if (targetType === forTargetType) {
      const target = state.entities[targetId];
      if (target) {
        target.comments ??= [];
        target.comments.push(action.payload.result);
      }
    }
  });
};

const legoAdapter = createLegoAdapter(EntityType.Comments);

const commentSlice = createSlice({
  name: EntityType.Comments,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addReactionCases(EntityType.Comments, addCase);

      addCase(Comment.DELETE.SUCCESS, (state, action: AnyAction) => {
        const comment = state.entities[action.meta.id];
        if (comment) {
          comment.text = null;
          comment.author = null;
        }
      });
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
