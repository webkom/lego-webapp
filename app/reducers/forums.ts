import { createSelector } from '@reduxjs/toolkit';
import { Forum } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'forums',
  types: {
    fetch: Forum.FETCH_ALL,
    mutate: Forum.CREATE,
    delete: Forum.DELETE,
  },
});

export const selectForums = createSelector(
  (state) => state.forums.byId,
  (state) => state.forums.items,
  (forumsById, forumsIds) => forumsIds.map((id) => forumsById[id])
);

export const selectForumsById = createSelector(
  (state) => state.forums.byId,
  (state, props) => props.forumId,
  (forumsByid, forumId) => forumsByid[forumId]
);
