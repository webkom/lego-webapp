import cx from 'classnames';
import type { ID } from 'app/models';
import type { CommentEntity } from 'app/reducers/comments';
import type { UserEntity } from 'app/reducers/users';
import Comment from './Comment';
import styles from './CommentTree.css';

type Props = {
  comments: Array<CommentEntity>;
  isChild?: boolean;
  commentFormProps: {
    contentTarget: string;
    user: UserEntity;
    loggedIn: boolean;
  };
  level?: number;
  deleteComment: (id: ID, contentTarget: string) => Promise<any>;
  user: UserEntity;
  contentTarget: string;
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
