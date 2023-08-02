import { LoadingIndicator } from '@webkom/lego-bricks';
import CommentForm from 'app/components/CommentForm';
import { Flex } from 'app/components/Layout';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
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
  contentAuthors?: ContentAuthors;
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
    contentAuthors,
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
        gap="1rem"
        style={{
          flexDirection: newOnTop ? 'column-reverse' : 'column',
        }}
      >
        {!formDisabled && <CommentForm {...commentFormProps} />}

        <LoadingIndicator loading={!comments}>
          {comments && (
            <CommentTree
              comments={newOnTop ? tree.reverse() : tree}
              commentFormProps={commentFormProps}
              deleteComment={deleteComment}
              user={user}
              contentTarget={contentTarget}
              contentAuthors={contentAuthors}
            />
          )}
        </LoadingIndicator>
      </Flex>
    </div>
  );
};

export default CommentView;
