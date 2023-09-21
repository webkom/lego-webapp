import cx from 'classnames';
import Comment from './Comment';
import styles from './CommentTree.css';
import type CommentType from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { Tree } from 'app/utils';

type Props = {
  comments: Tree<CommentType>;
  isChild?: boolean;
  commentFormProps: {
    contentTarget: ContentTarget;
    user: CurrentUser;
    loggedIn: boolean;
  };
  level?: number;
  user: CurrentUser;
  contentTarget: ContentTarget;
  contentAuthors?: ContentAuthors;
};

function CommentTree({
  comments,
  isChild = false,
  commentFormProps,
  level = 0,
  user,
  contentTarget,
  contentAuthors,
}: Props) {
  const tree = comments.map((comment) => {
    const className = cx(
      styles.commentTree,
      isChild && level < 3 && styles.nested,
      isChild ? styles.child : styles.root
    );

    if (comment.children.length) {
      return (
        <div key={comment.id} data-ischild={isChild} className={className}>
          <Comment
            comment={comment}
            commentFormProps={commentFormProps}
            user={user}
            contentTarget={contentTarget}
            contentAuthors={contentAuthors}
          />

          <CommentTree
            comments={comment.children}
            isChild
            level={level + 1}
            commentFormProps={commentFormProps}
            user={user}
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
          user={user}
          contentTarget={contentTarget}
          contentAuthors={contentAuthors}
        />
      </div>
    );
  });

  return <div>{tree}</div>;
}

export default CommentTree;
