import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from 'app/components/CommentForm';
import DisplayContent from 'app/components/DisplayContent';
import Icon from 'app/components/Icon';
import { ProfilePicture } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Tag } from 'app/components/Tags';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import type { ID } from 'app/store/models';
import type CommentType from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
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
  contentAuthors?: ContentAuthors;
};

const Comment = ({
  comment,
  contentTarget,
  commentFormProps,
  deleteComment,
  user,
  contentAuthors,
}: Props) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const { createdAt, text, author } = comment;

  return (
    <>
      <div className={styles.comment}>
        {author ? (
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap="1rem">
              <Link to={`/users/${author.username}`}>
                <ProfilePicture size={40} user={author} />
              </Link>

              <Flex column className={styles.username}>
                <Flex alignItems="center" gap={10}>
                  <Link to={`/users/${author.username}`}>
                    {author.fullName}
                  </Link>
                  {[contentAuthors].flat().includes(author.id) && (
                    <Tag
                      icon="shield-checkmark-outline"
                      tag="Forfatter"
                      color="blue"
                    />
                  )}
                </Flex>
                <Time className={styles.timestamp} time={createdAt} wordsAgo />
              </Flex>
            </Flex>

            {user?.id === author.id && (
              <Flex justifyContent="flex-end">
                <Tooltip content="Slett kommentar">
                  <Icon
                    danger
                    name="trash"
                    size={20}
                    onClick={() => deleteComment(comment.id, contentTarget)}
                  />
                </Tooltip>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap="1rem">
              <div className={styles.anonymousProfilePicture} />

              <Flex column className={styles.username}>
                <span>Ukjent bruker</span>
                <Time className={styles.timestamp} time={createdAt} wordsAgo />
              </Flex>
            </Flex>
          </Flex>
        )}

        <DisplayContent
          id="comment-text"
          className={styles.text}
          content={text ? text : '<p>Kommentar slettet</p>'}
        />

        {author && (
          <Button flat onClick={() => setReplyOpen(!replyOpen)}>
            {replyOpen ? (
              'Avbryt'
            ) : (
              <>
                <Icon name="return-up-back" size={20} />
                Svar
              </>
            )}
          </Button>
        )}
      </div>

      {replyOpen && (
        <CommentForm
          {...commentFormProps}
          submitText="Send svar"
          autoFocus
          parent={comment.id}
          placeholder={`Svar ${author.fullName} ...`}
        />
      )}
    </>
  );
};

export default Comment;
