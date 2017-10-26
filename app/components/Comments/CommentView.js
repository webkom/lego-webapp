// @flow

import React from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import { Flex } from 'app/components/Layout';
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
  style?: Object,
  newOnTop?: boolean
};

const Title = ({ displayTitle }: { displayTitle: boolean }) =>
  displayTitle && <h3>Kommentarer</h3>;

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    commentTarget,
    user,
    loggedIn,
    style,
    displayTitle = true,
    newOnTop = false
  } = props;
  const commentFormProps = { commentTarget, user, loggedIn };
  const tree = generateTreeStructure(comments);

  return (
    <div style={style}>
      <Title displayTitle={displayTitle} />
      <Flex
        style={{
          flexDirection: newOnTop ? 'column-reverse' : 'column'
        }}
      >
        <LoadingIndicator loading={!comments}>
          {comments && (
            <CommentTree
              comments={newOnTop ? tree.reverse() : tree}
              commentFormProps={commentFormProps}
            />
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
      </Flex>
    </div>
  );
};

export default CommentView;
