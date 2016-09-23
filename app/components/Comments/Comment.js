// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import CommentForm from 'app/components/CommentForm';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './Comment.css';

type Props = {
  comment: Object,
  commentFormProps: Object
};

export default class Comment extends Component {
  props: Props;

  state = {
    replyOpen: false
  };

  openReply = () => {
    this.setState({
      replyOpen: true
    });
  };

  closeReply = () => {
    this.setState({
      replyOpen: false
    });
  };

  render() {
    const { comment, commentFormProps } = this.props;
    const { createdAt, text, author } = comment;
    const { replyOpen } = this.state;

    return (
      <div>
        <div className={styles.comment}>
          <ProfilePicture
            username={author.username}
            size={64}
            style={{ marginRight: 20 }}
          />

          <div className={styles.content}>
            <div className={styles.header}>
              <Link to={`/users/${author.username}`}>
                {author.username}
              </Link>
              <span className={styles.bullet}>•</span>
              <Time className={styles.timestamp} time={createdAt} wordsAgo />
              <span className={styles.bullet}>•</span>
              <a onClick={this.openReply}>Svar</a>
            </div>

            <div className={styles.text}>{text}</div>
          </div>
        </div>

        {replyOpen ?
          <div>
            <button type='button' onClick={this.closeReply}>x</button>
            <CommentForm
              formKey={`${commentFormProps.commentTarget}-${comment.id}`}
              parent={comment.id}
              {...commentFormProps}
            />
          </div>
          : null}
      </div>
    );
  }
}
