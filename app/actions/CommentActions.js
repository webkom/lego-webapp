import { commentSchema } from 'app/reducers';
import { Comment } from './ActionTypes';
import { callAPI } from '../utils/http';
import { startSubmit, stopSubmit, initializeWithKey } from 'redux-form';

export function addComment({ text, commentTarget, parent }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('comment'));

    dispatch(callAPI({
      types: Comment.ADD,
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
      let formKey = commentTarget;
      if (parent) {
        formKey += `-${parent}`;
      }

      dispatch(initializeWithKey('comment', formKey, { text: '' }, ['text']));
    }).catch((action) => {
      const errors = { ...action.error.response.body };
      if (errors.text) {
        errors.text = errors.text[0];
      }
      dispatch(stopSubmit('comment', errors));
    });
  };
}
