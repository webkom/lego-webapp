// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import CommentForm from 'app/components/CommentForm';
import { ProfilePicture } from 'app/components/Image';
import DisplayContent from 'app/components/DisplayContent';
import styles from './Comment.css';
import { Flex } from 'app/components/Layout';
import { type UserEntity } from 'app/reducers/users';
import { type CommentEntity } from 'app/reducers/comments';
import type { ID } from 'app/models';
import Button from '../Button';

type Props = {
  comment: CommentEntity,
  commentFormProps: {
    contentTarget: string,
    user: UserEntity,
    loggedIn: boolean
  },
  deleteComment: (id: ID, contentTarget: string) => Promise<*>,
  user: UserEntity,
  contentTarget: string
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
    const {
      comment,
      contentTarget,
      commentFormProps,
      deleteComment,
      user
    } = this.props;
    const { createdAt, text, author } = comment;
    const { replyOpen } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.comment}>
          {author && (
            <div className={styles.header}>
              <ProfilePicture
                size={40}
                user={author}
                className={styles.profileImage}
              />
              <Flex className={styles.username}>
                <Link to={`/users/${author.username}`}>{author.username}</Link>
                <span className={styles.bullet}>•</span>
                <Time className={styles.timestamp} time={createdAt} wordsAgo />
                <span className={styles.bullet}>•</span>
              </Flex>
              <Flex className={styles.links}>
                <Button flat onClick={this.toggleReply}>
                  {this.state.replyOpen ? 'Lukk svar' : 'Svar'}
                </Button>
                {user && author.id == user.id && (
                  <Button
                    flat
                    className={styles.delete}
                    onClick={() => deleteComment(comment.id, contentTarget)}
                  >
                    Slett
                  </Button>
                )}
              </Flex>
            </div>
          )}
          <div className={styles.content}>
            <DisplayContent
              id="comment-text"
              className={styles.text}
              style={{ fontStyle: this.state.replyOpen && 'italic' }}
              content={text ? text : '<p>Slettet</p>'}
            />
          </div>
        </div>

        {replyOpen && (
          <CommentForm
            form={`comment.${commentFormProps.contentTarget}-${comment.id}`}
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
