// @flow

import { generateTreeStructure } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentForm from 'app/components/CommentForm';
import { Flex } from 'app/components/Layout';
import type { UserEntity } from 'app/reducers/users';
import CommentTree from './CommentTree';
import type { CommentEntity } from 'app/reducers/comments';
import type { ID } from 'app/models';

type Props = {
  comments: Array<CommentEntity>,
  formDisabled?: boolean,
  contentTarget: string,
  user: UserEntity,
  loggedIn: boolean,
  displayTitle?: boolean,
  style?: Object,
  newOnTop?: boolean,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>,
};

const Title = ({ displayTitle }: { displayTitle: boolean }) =>
  displayTitle && <h3>Kommentarer</h3>;

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    contentTarget,
    user,
    loggedIn,
    style,
    displayTitle = true,
    newOnTop = false,
    deleteComment,
  } = props;
  const commentFormProps = { contentTarget, user, loggedIn };

  const tree = generateTreeStructure(comments);

  return (
    <div style={style}>
      <Title displayTitle={displayTitle} />
      <Flex
        style={{
          flexDirection: newOnTop ? 'column-reverse' : 'column',
        }}
      >
        <LoadingIndicator loading={!comments}>
          {comments && (
            <CommentTree
              comments={newOnTop ? tree.reverse() : tree}
              commentFormProps={commentFormProps}
              deleteComment={deleteComment}
              user={user}
              contentTarget={contentTarget}
            />
          )}
        </LoadingIndicator>

        {!formDisabled && (
          <div>
            <CommentForm {...commentFormProps} />
          </div>
        )}
      </Flex>
    </div>
  );
};

export default CommentView;
