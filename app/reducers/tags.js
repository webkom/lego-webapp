// @flow
import { createSelector } from 'reselect';
import { Tag } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'tags',
  types: {
    fetch: Tag.FETCH
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Tag.POPULAR.SUCCESS: {
          newState.popular = action.payload;
        }
      }
    }
  )
});

export const selectTags = createSelector(
  state => state.tags.byId,
  state => state.tags.items,
  (tagsById, tagsId) => tagsId.map(tag => tagsById[tag])
);

export const selectTagById = createSelector(
  state => state.tags.byId,
  (state, props) => props.tagId,
  (tagsById, tagId) => tagsById[tagId] || {}
);

export const selectPopularTags = (state: Object) => state.tags.popular || [];
