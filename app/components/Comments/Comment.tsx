import { Component } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from 'app/components/CommentForm';
import DisplayContent from 'app/components/DisplayContent';
import { ProfilePicture } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Time from 'app/components/Time';
import type { ID } from 'app/store/models';
import type CommentType from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import Button from '../Button';
import styles from './Comment.css';

type Props = {
  comment: CommentType;
  commentFormProps: {
    contentTarget: string;
    user: CurrentUser;
    loggedIn: boolean;
  };
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
  user: CurrentUser;
  contentTarget: string;
};
type State = {
  replyOpen: boolean;
};
export default class Comment extends Component<Props, State> {
  state = {
    replyOpen: false,
  };
  closeReply = () => {
    this.setState({
      replyOpen: false,
    });
  };
  toggleReply = () => {
    this.setState((prevState) => ({
      replyOpen: !prevState.replyOpen,
    }));
  };

  render() {
    const { comment, contentTarget, commentFormProps, deleteComment, user } =
      this.props;
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
                <Link to={`/users/${author.username}`}>{author.fullName}</Link>
                <span className={styles.bullet}>•</span>
                <Time className={styles.timestamp} time={createdAt} wordsAgo />
                <span className={styles.bullet}>•</span>
              </Flex>
              <Flex className={styles.links}>
                <Button flat onClick={this.toggleReply}>
                  {this.state.replyOpen ? 'Lukk svar' : 'Svar'}
                </Button>
                {user && author.id === user.id && (
                  <Button
                    flat
                    onClick={() => deleteComment(comment.id, contentTarget)}
                    className={styles.delete}
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
              style={{
                fontStyle: this.state.replyOpen && 'italic',
              }}
              content={text ? text : '<p>Slettet</p>'}
            />
          </div>
        </div>

        {replyOpen && (
          <CommentForm
            {...commentFormProps}
            submitText="Send svar"
            inlineMode
            autoFocus
            parent={comment.id}
          />
        )}
      </div>
    );
  }
}
