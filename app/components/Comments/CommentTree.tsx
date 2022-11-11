import cx from 'classnames';
import type { ID, Comment as CommentType, User } from 'app/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { Tree } from 'app/utils';
import Comment from './Comment';
import styles from './CommentTree.css';

type Props = {
  comments: Tree<CommentType>;
  isChild?: boolean;
  commentFormProps: {
    contentTarget: ContentTarget;
    user: User;
    loggedIn: boolean;
  };
  level?: number;
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
  user: User;
  contentTarget: ContentTarget;
};

function CommentTree({
  comments,
  isChild = false,
  commentFormProps,
  level = 0,
  deleteComment,
  user,
  contentTarget,
}: Props) {
  const tree = comments.map((comment) => {
    const className = cx(
      isChild && level < 3 && styles.nested,
      isChild ? styles.child : styles.root
    );

    if (comment.children.length) {
      return (
        <div key={comment.id} className={className}>
          <Comment
            comment={comment}
            commentFormProps={commentFormProps}
            deleteComment={deleteComment}
            user={user}
            contentTarget={contentTarget}
          />

          <CommentTree
            comments={comment.children}
            isChild
            level={level + 1}
            commentFormProps={commentFormProps}
            deleteComment={deleteComment}
            user={user}
            contentTarget={contentTarget}
          />
        </div>
      );
    }

    return (
      <div key={comment.id} className={className}>
        <Comment
          key={comment.id}
          comment={comment}
          commentFormProps={commentFormProps}
          deleteComment={deleteComment}
          user={user}
          contentTarget={contentTarget}
        />
      </div>
    );
  });
  return <div>{tree}</div>;
}

export default CommentTree;
