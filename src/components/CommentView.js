import React, { Component, PropTypes } from 'react';
import { generateTreeStructure } from '../utils';
import LoadingIndicator from './ui/LoadingIndicator';
import Comment from './Comment';

const CommentTree = ({ comments }) => {
  const tree = comments.map(comment => {
    if (comment.children.length) {
      return (
        <div key={comment.id} className='comment-tree'>
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

export default class CommentView extends Component {
  static propTypes = {
    comments: PropTypes.array
  };

  render() {
    const { comments } = this.props;
    const tree = generateTreeStructure(comments);
    console.log('hei', <CommentTree comments={tree} />);
    return (
      <div>
        <h4>Comments</h4>
        <LoadingIndicator loading={!comments}>
          {comments && <CommentTree comments={tree} />}
        </LoadingIndicator>
      </div>
    );
  }
}
