// @flow

import React from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import CommentTree from './CommentTree';

type Props = {
  comments: Array<{
    id: string,
    parent: string
  }>,
  formDisabled?: boolean,
  commentTarget: string,
  user: Object,
  loggedIn: boolean,
  displayTitle?: boolean
};

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    commentTarget,
    user,
    loggedIn,
    displayTitle = true
  } = props;
  const commentFormProps = { commentTarget, user, loggedIn };
  const tree = generateTreeStructure(comments);

  return (
    <div>
      {comments.length > 0 && displayTitle && <h3>Diskusjon</h3>}
      <LoadingIndicator loading={!comments}>
        {comments && (
          <CommentTree comments={tree} commentFormProps={commentFormProps} />
        )}
      </LoadingIndicator>

      {!formDisabled && (
        <div>
          {displayTitle && (
            <h3>
              {comments.length
                ? 'Ta del i diskusjonen eller få svar på dine spørsmål'
                : 'Start en diskusjon eller still et spørsmål'}
            </h3>
          )}

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
