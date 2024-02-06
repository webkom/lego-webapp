import { createSelector } from '@reduxjs/toolkit';
import { Thread } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { mutateComments, selectCommentEntities } from './comments';
import type { ID } from 'app/models';

const mutate = mutateComments('threads');

export default createEntityReducer({
  key: 'threads',
  types: {
    fetch: Thread.FETCH_ALL,
    mutate: Thread.CREATE,
    delete: Thread.DELETE,
  },
  mutate,
});

export const selectThreadsByForumId = (forumId: ID) =>
  createSelector(
    (state) => state.threads.byId,
    (state) => state.threads.items,
    (threadsById, threadIds) => {
      const filteredThreadIds = threadIds.filter((id) => {
        const thread = threadsById[id];
        return thread && thread.forum === forumId;
      });

      return filteredThreadIds.map((id) => threadsById[id]);
    }
  );

export const selectThreads = createSelector(
  (state) => state.threads.byId,
  (state) => state.threads.items,
  (threadsById, threadsIds) => threadsById.map((id) => threadsIds[id])
);

export const selectThreadsById = createSelector(
  (state) => state.threads.byId,
  (state, props) => props.threadId,
  (threadsById, threadId) => threadsById[threadId]
);

export const selectCommentsByIds = createSelector(
  [selectCommentEntities, (state, commentIds) => commentIds],
  (comments, commentIds) => {
    return commentIds?.reduce((acc, id) => {
      const comment = comments[id];
      if (comment) {
        acc.push(comment);
      }
      return acc;
    }, []);
  }
);
