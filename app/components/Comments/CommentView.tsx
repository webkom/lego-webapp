import CommentForm from 'app/components/CommentForm';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import { generateTreeStructure } from 'app/utils';
import CommentTree from './CommentTree';
import type { CSSProperties } from 'react';

type Props = {
  comments: Array<Comment>;
  formDisabled?: boolean;
  contentTarget: ContentTarget;
  user: CurrentUser;
  loggedIn: boolean;
  displayTitle?: boolean;
  style?: CSSProperties;
  newOnTop?: boolean;
  deleteComment: (id: ID, contentTarget: ContentTarget) => Promise<void>;
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
  const commentFormProps = {
    contentTarget,
    user,
    loggedIn,
  };
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
