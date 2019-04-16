import React from 'react';
import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import { Flex } from 'app/components/Layout';
import { UserEntity } from 'app/reducers/users';
import CommentTree from './CommentTree';
import { CommentEntity } from 'app/reducers/comments';
import { ID } from 'app/models';

interface Props {
  comments: Array<CommentEntity>,
  formDisabled?: boolean,
  commentTarget: string,
  user: UserEntity,
  loggedIn: boolean,
  displayTitle?: boolean,
  style?: Object,
  newOnTop?: boolean,
  deleteComment: (id: ID, commentTarget: string) => Promise<*>
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
    newOnTop = false,
    deleteComment
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
              deleteComment={deleteComment}
              user={user}
              commentTarget={commentTarget}
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
