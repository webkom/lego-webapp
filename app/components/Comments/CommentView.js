// @flow

import React from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import { type CommentEntity } from 'app/reducers/comments';
import { type UserEntity } from 'app/reducers/users';
import CommentTree from './CommentTree';

type Props = {
  comments: Array<CommentEntity>,
  formDisabled?: boolean,
  commentTarget: string,
  user: UserEntity,
  loggedIn: boolean
};

const CommentView = ({
  comments,
  formDisabled = false,
  commentTarget,
  user,
  loggedIn
}: Props) => {
  const commentFormProps = { commentTarget, user, loggedIn };
  const tree = generateTreeStructure(comments);

  return (
    <div>
      {comments.length > 0 && <h3>Diskusjon</h3>}
      <LoadingIndicator loading={!comments}>
        {comments && (
          <CommentTree comments={tree} commentFormProps={commentFormProps} />
        )}
      </LoadingIndicator>

      {!formDisabled && (
        <div>
          <h3>
            {comments.length
              ? 'Ta del i diskusjonen eller få svar på dine spørsmål'
              : 'Start en diskusjon eller still et spørsmål'}
          </h3>

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
