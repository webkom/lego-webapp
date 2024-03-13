import { produce } from 'immer';
import { createSelector } from 'reselect';
import { Tag } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

type State = any;
export default createEntityReducer({
  key: 'tags',
  types: {
    fetch: Tag.FETCH,
  },
  mutate: produce((newState: State, action: any): void => {
    switch (action.type) {
      case Tag.POPULAR.SUCCESS: {
        newState.popular = action.payload;
        break;
      }

      default:
        break;
    }
  }),
});
export const selectTags = createSelector(
  (state) => state.tags.byId,
  (state) => state.tags.items,
  (tagsById, tagsId) => tagsId.map((tag) => tagsById[tag])
);
export const selectTagById = createSelector(
  (state) => state.tags.byId,
  (state, props) => props.tagId,
  (tagsById, tagId) => tagsById[tagId] || {}
);
export const selectPopularTags = (state: Record<string, any>) =>
  state.tags.popular || [];
