import callAPI from 'app/actions/callAPI';
import { commentSchema } from 'app/reducers';
import { Comment } from './ActionTypes';
import type { ID } from 'app/store/models';
import type CommentType from 'app/store/models/Comment';
import type { Thunk } from 'app/types';

export function addComment({
  text,
  contentTarget,
  parent,
}: CommentType): Thunk<Promise<Record<string, any> | null | undefined>> {
  return callAPI({
    types: Comment.ADD,
    endpoint: '/comments/',
    method: 'POST',
    body: {
      text,
      content_target: contentTarget,
      ...(parent
        ? {
            parent,
          }
        : {}),
    },
    meta: {
      contentTarget,
      errorMessage: 'Kommentering feilet',
    },
    schema: commentSchema,
  });
}
export function deleteComment(
  commentId: ID,
  contentTarget: string
): Thunk<any> {
  return callAPI({
    types: Comment.DELETE,
    endpoint: `/comments/${commentId}/`,
    method: 'DELETE',
    meta: {
      id: commentId,
      contentTarget,
      errorMessage: 'Sletting av kommentar feilet',
      successMessage: 'Kommentar slettet',
    },
  });
}
