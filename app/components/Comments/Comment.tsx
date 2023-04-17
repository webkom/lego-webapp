import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from 'app/components/CommentForm';
import DisplayContent from 'app/components/DisplayContent';
import { ProfilePicture } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Time from 'app/components/Time';
import type { ID } from 'app/store/models';
import type CommentType from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import Button from '../Button';
import styles from './Comment.css';

type Props = {
  comment: CommentType;
  commentFormProps: {
    contentTarget: string;
    user: CurrentUser;
    loggedIn: boolean;
  };
  deleteComment: (id: ID, contentTarget: ContentTarget) => Promise<void>;
  user: CurrentUser;
  contentTarget: ContentTarget;
};

const Comment = ({
  comment,
  contentTarget,
  commentFormProps,
  deleteComment,
  user,
}: Props) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const { createdAt, text, author } = comment;

  return (
    <div className={styles.container}>
      <div className={styles.comment}>
        {author && (
          <div className={styles.header}>
            <ProfilePicture
              size={40}
              user={author}
              alt={`${author.username}'s profile picture`}
              className={styles.profileImage}
            />
            <Flex className={styles.username}>
              <Link to={`/users/${author.username}`}>{author.fullName}</Link>
              <span className={styles.bullet}>•</span>
              <Time className={styles.timestamp} time={createdAt} wordsAgo />
              <span className={styles.bullet}>•</span>
            </Flex>
            <Flex className={styles.links}>
              <Button flat onClick={() => setReplyOpen(!replyOpen)}>
                {replyOpen ? 'Lukk svar' : 'Svar'}
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
              fontStyle: replyOpen && 'italic',
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
};

export default Comment;
