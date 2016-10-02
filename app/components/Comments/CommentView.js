// @flow

import React, { Component } from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import CommentTree from './CommentTree';

type Props = {
  comments: Array<{
    id: string,
    parent: string
  }>,
  formDisabled: boolean,
  commentTarget: string,
  user: Object,
  loggedIn: boolean
};

export default class CommentView extends Component {
  props: Props;

  render() {
    const { comments, formDisabled, commentTarget, user, loggedIn } = this.props;
    const commentFormProps = { commentTarget, user, loggedIn };
    const tree = generateTreeStructure(comments);

    return (
      <div>
        {comments.length > 0 && <h3>Diskusjon</h3>}
        <LoadingIndicator loading={!comments}>
          {comments && (
            <CommentTree
              comments={tree}
              commentFormProps={commentFormProps}
            />
          )}
        </LoadingIndicator>

        {!formDisabled && (
          <div>
            <h3>{comments.length
              ? 'Ta del i diskusjonen eller få svar på dine spørsmål'
              : 'Start en diskusjon eller still et spørsmål'
            }</h3>

            <CommentForm
              form={`comment.${commentFormProps.commentTarget}`}
              {...commentFormProps}
            />
          </div>
        )}
      </div>
    );
  }
}
