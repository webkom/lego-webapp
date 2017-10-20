// @flow

import React from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import type { CommentEntity } from 'app/reducers/comments';
import type { UserEntity } from 'app/reducers/users';
import CommentTree from './CommentTree';

type Props = {
  comments: Array<CommentEntity>,
  formDisabled?: boolean,
  commentTarget: string,
  user: UserEntity,
  loggedIn: boolean,
  displayTitle?: boolean,
  style?: Object
};

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    commentTarget,
    user,
    loggedIn,
    style,
    displayTitle = true
  } = props;
  const commentFormProps = { commentTarget, user, loggedIn };
  const tree = generateTreeStructure(comments);

  return (
    <div style={style}>
      {displayTitle && <h3>Kommentarer</h3>}
      <LoadingIndicator loading={!comments}>
        {comments && (
          <CommentTree comments={tree} commentFormProps={commentFormProps} />
        )}
      </LoadingIndicator>

      {!formDisabled && (
        <div>
          <CommentForm
            form={`comment.${commentFormProps.commentTarget}`}
            {...commentFormProps}
          />
        </div>
      )}
    </div>
  );
};

export default CommentView;
