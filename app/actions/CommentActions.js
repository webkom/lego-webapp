import { commentSchema } from 'app/reducers';
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
        id: Date.now(),
        text,
        comment_target: commentTarget,
        ...(parent ? { parent } : {})
      },
      meta: {
        commentTarget,
        errorMessage: 'Posting comment failed'
      },
      schema: commentSchema
    })).then(() => {
      dispatch(stopSubmit('comment'));
    }).catch((action) => {
      const errors = { ...action.error.response.body };
      if (errors.text) {
        errors.text = errors.text[0];
      }
      dispatch(stopSubmit('comment', errors));
    });
  };
}
