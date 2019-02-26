// @flow

import React from 'react';
import cx from 'classnames';
import Comment from './Comment';
import styles from './CommentTree.css';
import { type UserEntity } from 'app/reducers/users';

type Props = {
  comments: Array<Object>,
  isChild?: boolean,
  commentFormProps: Object,
  level?: number,
  deleteComment: (id: string, commentTarget: string) => Promise<*>,
  user: UserEntity,
  commentTarget: string
};

function CommentTree({
  comments,
  isChild = false,
  commentFormProps,
  level = 0,
  deleteComment,
  user,
  commentTarget
}: Props) {
  const tree = comments.map(comment => {
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
            commentTarget={commentTarget}
          />

          <CommentTree
            comments={comment.children}
            isChild
            level={level + 1}
            commentFormProps={commentFormProps}
            deleteComment={deleteComment}
            user={user}
            commentTarget={commentTarget}
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
          commentTarget={commentTarget}
        />
      </div>
    );
  });

  return <div>{tree}</div>;
}

export default CommentTree;
