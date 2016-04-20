import React, { Component, PropTypes } from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentTree from './CommentTree';
import CommentForm from 'app/components/CommentForm';

export default class CommentView extends Component {
  static propTypes = {
    comments: PropTypes.array,
    formDisabled: PropTypes.bool,
    commentTarget: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { comments, formDisabled, commentTarget, user, loggedIn } = this.props;
    const commentFormProps = { commentTarget, user, loggedIn };
    const tree = generateTreeStructure(comments);
    return (
      <div>
        <h4>Comments</h4>
        <LoadingIndicator loading={!comments}>
          {!formDisabled && comments ?
            <CommentForm {...commentFormProps} />
            : null
          }
          {comments && <CommentTree comments={tree} commentFormProps={commentFormProps} />}
        </LoadingIndicator>
      </div>
    );
  }
}
