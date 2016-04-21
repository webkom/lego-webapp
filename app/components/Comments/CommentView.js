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
        {comments.length ? <h3>Diskusjon</h3> : null}
        <LoadingIndicator loading={!comments}>
          {comments && <CommentTree comments={tree} commentFormProps={commentFormProps} />}
        </LoadingIndicator>

        {!formDisabled ? (
          <div>
            <h3>{comments.length
              ? 'Ta del i diskusjonen eller få svar på dine spørsmål'
              : 'Start en diskusjon eller still et spørsmål'
            }</h3>
            <CommentForm {...commentFormProps} />
          </div>
        ) : null}
      </div>
    );
  }
}
