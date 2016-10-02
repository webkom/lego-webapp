import { startSubmit, stopSubmit, initialize } from 'redux-form';
import { commentSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Comment } from './ActionTypes';

export function addComment({ text, commentTarget, parent }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('comment'));

    dispatch(callAPI({
      types: Comment.ADD,
      endpoint: '/comments/',
      method: 'post',
      body: {
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
      let formName = `comment.${commentTarget}`;
      if (parent) {
        formName += `-${parent}`;
      }

      dispatch(initialize(formName, { text: '' }));
    }).catch((action) => {
      const errors = { ...action.error.response.jsonData };
      dispatch(stopSubmit('comment', errors));
    });
  };
}
