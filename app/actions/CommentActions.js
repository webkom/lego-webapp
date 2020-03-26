// @flow

import { startSubmit, stopSubmit, initialize } from 'redux-form';
import { commentSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Comment } from './ActionTypes';
import type { Thunk } from 'app/types';
import { type ID } from 'app/models';

export type CommentEntity = {
  text: string,
  contentTarget: string,
  parent: number
};

export function addComment({
  text,
  contentTarget,
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
          content_target: contentTarget,
          ...(parent ? { parent } : {})
        },
        meta: {
          contentTarget,
          errorMessage: 'Legg til kommentar feilet'
        },
        schema: commentSchema
      })
    )
      .then(() => {
        dispatch(stopSubmit('comment'));
        let formName = `comment.${contentTarget}`;
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

export function deleteComment(commentId: ID, contentTarget: string) {
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
