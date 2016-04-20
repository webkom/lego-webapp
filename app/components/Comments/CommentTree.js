import './CommentTree.css';
import React, { PropTypes } from 'react';
import Comment from './Comment';

const CommentTree = ({ comments, isChild = false, commentFormProps }) => {
  const tree = comments.map((comment) => {
    const suffix = isChild ? 'child' : 'root';
    const className = `CommentTree__${suffix}`;
    if (comment.children.length) {
      return (
        <div key={comment.id} className={className}>
          <Comment comment={comment} commentFormProps={commentFormProps} />
          <CommentTree comments={comment.children} isChild commentFormProps={commentFormProps} />
        </div>
      );
    }

    return (
      <div key={comment.id} className={className}>
        <Comment key={comment.id} comment={comment} commentFormProps={commentFormProps} />
      </div>
    );
  });

  return (
    <div>
      {tree}
    </div>
  );
};

CommentTree.propTypes = {
  comments: PropTypes.array.isRequired
};

export default CommentTree;
