import React, { PropTypes } from 'react';
import Comment from './Comment';

const CommentTree = ({ comments }) => {
  const tree = comments.map(comment => {
    if (comment.children.length) {
      return (
        <div key={comment.id} className='CommentTree'>
          <Comment comment={comment} />
          <CommentTree comments={comment.children} />
        </div>
      );
    }

    return <Comment key={comment.id} comment={comment} />;
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
