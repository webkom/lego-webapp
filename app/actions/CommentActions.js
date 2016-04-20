import { Comment } from './ActionTypes';
import { callAPI } from '../utils/http';
import { startSubmit, stopSubmit } from 'redux-form';

export function addComment({ text, commentTarget, parent }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('comment'));

    dispatch(callAPI({
      types: [Comment.ADD_BEGIN, Comment.ADD_SUCCESS, Comment.ADD_FAILURE],
      endpoint: '/comments/',
      method: 'post',
      body: {
        text,
        comment_target: commentTarget,
        ...(parent ? { parent } : {})
      },
      meta: {
        commentTarget
      }
    })).then(
      () => {
        dispatch(stopSubmit('comment'));
      },
      (error) => {
        const errors = { ...error.response.body };
        if (errors.text) {
          errors.text = errors.text[0];
        }
        dispatch(stopSubmit('comment', errors));
      }
    );
  };
}
