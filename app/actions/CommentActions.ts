

import { startSubmit, stopSubmit, initialize } from 'redux-form';
import { commentSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Comment } from './ActionTypes';
import { Thunk } from 'app/types';
import { type ID } from 'app/types/models';

export type CommentEntity = {
  text: string,
  commentTarget: string,
  parent: string
};

export function addComment({
  text,
  commentTarget,
  parent
}: CommentEntity): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('comment'));

    return dispatch(
      callAPI({
        types: Comment.ADD,
        endpoint: '/comments/',
        method: 'POST',
        body: {
          text,
          comment_target: commentTarget,
          ...(parent ? { parent } : {})
        },
        meta: {
          commentTarget,
          errorMessage: 'Legg til kommentar feilet'
        },
        schema: commentSchema
      })
    )
      .then(() => {
        dispatch(stopSubmit('comment'));
        let formName = `comment.${commentTarget}`;
        if (parent) {
          formName += `-${parent}`;
        }

        dispatch(initialize(formName, { text: '' }));
      })
      .catch(action => {
        const errors = { ...action.payload.response.jsonData };
        dispatch(stopSubmit('comment', errors));
      });
  };
}

export function deleteComment(commentId: ID, commentTarget: string) {
  return callAPI({
    types: Comment.DELETE,
    endpoint: `/comments/${commentId}/`,
    method: 'DELETE',
    meta: {
      id: commentId,
      commentTarget,
      errorMessage: 'Sletting av kommentar feilet',
      successMessage: 'Kommentar slettet'
    }
  });
}
