// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import CommentForm from 'app/components/CommentForm';
import { ProfilePicture } from 'app/components/Image';
import { type CommentEntity } from 'app/reducers/comments';
import DisplayContent from 'app/components/DisplayContent';
import styles from './Comment.css';

type Props = {
  comment: CommentEntity,
  commentFormProps: Object
};

type State = {
  replyOpen: boolean
};

export default class Comment extends Component<Props, State> {
  state = {
    replyOpen: false
  };

  closeReply = () => {
    this.setState({ replyOpen: false });
  };

  toggleReply = () => {
    this.setState(prevState => ({
      replyOpen: !prevState.replyOpen
    }));
  };

  render() {
    const { comment, commentFormProps } = this.props;
    const { createdAt, text, author } = comment;
    const { replyOpen } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.comment}>
          <div className={styles.header}>
            <ProfilePicture
              size={40}
              user={author}
              style={{ marginRight: 25 }}
            />

            <Link to={`/users/${author.username}`}>{author.username}</Link>
            <span className={styles.bullet}>•</span>
            <Time className={styles.timestamp} time={createdAt} wordsAgo />
            <span className={styles.bullet}>•</span>
            <a onClick={this.toggleReply}>
              {this.state.replyOpen ? 'Lukk svar' : 'Svar'}
            </a>
          </div>
          <div className={styles.content}>
            <DisplayContent
              id="comment-text"
              className={styles.text}
              style={{ fontStyle: this.state.replyOpen && 'italic' }}
              content={text}
            />
          </div>
        </div>

        {replyOpen && (
          <CommentForm
            form={`comment.${commentFormProps.commentTarget}-${comment.id}`}
            parent={comment.id}
            submitText="Send svar"
            inlineMode
            autoFocus
            {...commentFormProps}
          />
        )}
      </div>
    );
  }
}
