// @flow

import React from 'react';
import Comment from './Comment';
import styles from './CommentTree.css';

type Props = {
  comments: Array<Object>,
  isChild?: boolean,
  commentFormProps: Object
};

function CommentTree({ comments, isChild = false, commentFormProps }: Props) {
  const tree = comments.map((comment) => {
    const suffix = isChild ? 'child' : 'root';
    const className = styles[suffix];
    if (comment.children.length) {
      return (
        <div key={comment.id} className={className}>
          <Comment
            comment={comment}
            commentFormProps={commentFormProps}
          />

          <CommentTree
            comments={comment.children}
            isChild
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

  return (
    <div>
      {tree}
    </div>
  );
}

export default CommentTree;
