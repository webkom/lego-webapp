import cx from 'classnames';
import Comment from './Comment';
import styles from './CommentTree.module.css';
import type CommentType from '~/redux/models/Comment';
import type { ContentAuthors } from '~/redux/models/Comment';
import type { Tree } from '~/utils';
import type { ContentTarget } from '~/utils/contentTarget';

type Props = {
  comments: Tree<CommentType>;
  isChild?: boolean;
  commentFormProps: {
    contentTarget: ContentTarget;
  };
  level?: number;
  contentTarget: ContentTarget;
  contentAuthors?: ContentAuthors;
};

function CommentTree({
  comments,
  isChild = false,
  commentFormProps,
  level = 0,
  contentTarget,
  contentAuthors,
}: Props) {
  const tree = comments.map((comment) => {
    const className = cx(
      isChild && level < 3 && styles.nested,
      isChild ? styles.child : styles.root,
    );

    if (comment.children.length) {
      return (
        <div key={comment.id} data-ischild={isChild} className={className}>
          <Comment
            comment={comment}
            commentFormProps={commentFormProps}
            contentTarget={contentTarget}
            contentAuthors={contentAuthors}
          />

          <CommentTree
            comments={comment.children}
            isChild
            level={level + 1}
            commentFormProps={commentFormProps}
            contentTarget={contentTarget}
            contentAuthors={contentAuthors}
          />
        </div>
      );
    }

    return (
      <div key={comment.id} data-ischild={isChild} className={className}>
        <Comment
          key={comment.id}
          comment={comment}
          commentFormProps={commentFormProps}
          contentTarget={contentTarget}
          contentAuthors={contentAuthors}
        />
      </div>
    );
  });

  return <div>{tree}</div>;
}

export default CommentTree;
