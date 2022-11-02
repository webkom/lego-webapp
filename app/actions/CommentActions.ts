import { commentSchema } from "app/reducers";
import callAPI from "app/actions/callAPI";
import { Comment } from "./ActionTypes";
import type { Thunk } from "app/types";
import type { ID } from "app/models";
import "app/models";
export type CommentEntity = {
  text: string;
  contentTarget: string;
  parent?: number;
};
export function addComment({
  text,
  contentTarget,
  parent
}: CommentEntity): Thunk<Promise<Record<string, any> | null | undefined>> {
  return callAPI({
    types: Comment.ADD,
    endpoint: '/comments/',
    method: 'POST',
    body: {
      text,
      content_target: contentTarget,
      ...(parent ? {
        parent
      } : {})
    },
    meta: {
      contentTarget,
      errorMessage: 'Kommentering feilet'
    },
    schema: commentSchema
  });
}
export function deleteComment(commentId: ID, contentTarget: string): Thunk<any> {
  return callAPI({
    types: Comment.DELETE,
    endpoint: `/comments/${commentId}/`,
    method: 'DELETE',
    meta: {
      id: commentId,
      contentTarget,
      errorMessage: 'Sletting av kommentar feilet',
      successMessage: 'Kommentar slettet'
    }
  });
}