// @flow

import React from 'react';
import cx from 'classnames';
import Comment from './Comment';
import styles from './CommentTree.css';

type Props = {
  comments: Array<Object>,
  isChild?: boolean,
  commentFormProps: Object,
  level?: number
};

function CommentTree({
  comments,
  isChild = false,
  commentFormProps,
  level = 0
}: Props) {
  const tree = comments.map(comment => {
    const className = cx(
      isChild && level < 4 && styles.nested,
      isChild ? styles.child : styles.root
    );

    if (comment.children.length) {
      return (
        <div key={comment.id} className={className}>
          <Comment comment={comment} commentFormProps={commentFormProps} />

          <CommentTree
            comments={comment.children}
            isChild
            level={level + 1}
            commentFormProps={commentFormProps}
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
        />
      </div>
    );
  });

  return <div>{tree}</div>;
}

export default CommentTree;
