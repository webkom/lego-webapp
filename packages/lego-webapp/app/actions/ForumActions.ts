import { forumSchema, threadSchema } from 'app/reducers';
import { Forum, Thread } from './ActionTypes';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  CreateForum,
  CreateThread,
  DetailedForum,
  DetailedThread,
  PublicForum,
  PublicThread,
  UpdateForum,
  UpdateThread,
} from 'app/store/models/Forum';

export function fetchForums() {
  return callAPI<PublicForum[]>({
    types: Forum.FETCH_ALL,
    endpoint: '/forums/',
    schema: [forumSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av forum feilet',
    },
    propagateError: true,
    requiresAuthentication: true,
  });
}

export function fetchForum(forumId: EntityId) {
  return callAPI<DetailedForum>({
    types: Forum.FETCH,
    endpoint: `/forums/${forumId}/`,
    schema: forumSchema,
    meta: {
      errorMessage: 'Henting av forum feilet',
    },
    propagateError: true,
    requiresAuthentication: true,
  });
}

export function createForum(forum: CreateForum) {
  return callAPI<DetailedForum>({
    types: Forum.CREATE,
    endpoint: '/forums/',
    method: 'POST',
    body: forum,
    schema: forumSchema,
    meta: {
      errorMessage: 'Opprettelse av forum feilet',
    },
  });
}

export function editForum(forum: UpdateForum) {
  return callAPI({
    types: Forum.UPDATE,
    endpoint: `/forums/${forum.id}/`,
    method: 'PUT',
    body: { title: forum.title, description: forum.description },
    meta: {
      errorMessage: 'Endring av forum feilet',
    },
  });
}

export function deleteForum(forumId: EntityId) {
  return callAPI({
    types: Forum.DELETE,
    endpoint: `/forums/${forumId}/`,
    method: 'DELETE',
    meta: {
      id: forumId,
      errorMessage: 'Sletting av forum feilet',
    },
  });
}

export function fetchThreads() {
  return callAPI<PublicThread[]>({
    types: Thread.FETCH_ALL,
    endpoint: '/threads/',
    schema: [threadSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av tråder feilet',
    },
    propagateError: true,
  });
}

export function fetchThreadsByForum(forumId: EntityId) {
  return callAPI<PublicThread[]>({
    types: Thread.FETCH_ALL,
    endpoint: `/forums/${forumId}/threads/`,
    schema: [threadSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av tråder feilet',
    },
    propagateError: true,
  });
}

export function fetchThread(threadId: EntityId) {
  return callAPI<DetailedThread>({
    types: Thread.FETCH,
    endpoint: `/threads/${threadId}/`,
    schema: threadSchema,
    meta: {
      errorMessage: 'Henting av tråd feilet',
    },
    propagateError: true,
  });
}

export function fetchThreadByForum(forumId: EntityId, threadId: EntityId) {
  return callAPI<PublicThread[]>({
    types: Thread.FETCH,
    endpoint: `/forums/${forumId}/threads/${threadId}`,
    schema: threadSchema,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av tråder feilet',
    },
    propagateError: true,
  });
}

export function createThread(thread: CreateThread) {
  return callAPI<DetailedThread>({
    types: Thread.CREATE,
    endpoint: '/threads/',
    method: 'POST',
    body: thread,
    schema: threadSchema,
    meta: {
      errorMessage: 'Opprettelse av tråd feilet',
    },
  });
}

export function editThread(thread: UpdateThread) {
  return callAPI({
    types: Thread.UPDATE,
    endpoint: `/threads/${thread.id}/`,
    method: 'PUT',
    body: {
      title: thread.title,
      content: thread.content,
      forum: thread.forum,
    },
    meta: {
      errorMessage: 'Endring av tråd feilet',
    },
  });
}

export function deleteThread(threadId: EntityId) {
  return callAPI({
    types: Thread.DELETE,
    endpoint: `/threads/${threadId}/`,
    method: 'DELETE',
    meta: {
      id: threadId,
      errorMessage: 'Sletting av tråd feilet',
    },
  });
}
