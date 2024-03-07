import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import CommentForm from 'app/components/CommentForm';
import { generateTreeStructure } from 'app/utils';
import CommentTree from './CommentTree';
import type Comment from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { CSSProperties } from 'react';

type Props = {
  comments: Array<Comment>;
  formDisabled?: boolean;
  contentTarget: ContentTarget;
  displayTitle?: boolean;
  style?: CSSProperties;
  newOnTop?: boolean;
  contentAuthors?: ContentAuthors;
};

const Title = ({ displayTitle }: { displayTitle: boolean }) =>
  displayTitle && <h3>Kommentarer</h3>;

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    contentTarget,
    style,
    displayTitle = true,
    newOnTop = false,
    contentAuthors,
  } = props;
  const commentFormProps = {
    contentTarget,
  };
  const tree = generateTreeStructure(comments);
  return (
    <div style={style}>
      <Title displayTitle={displayTitle} />
      <Flex
        gap="var(--spacing-md)"
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
