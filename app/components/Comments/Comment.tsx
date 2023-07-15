import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
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
  contentAuthors?: ID[];
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
        {author && (
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap="1rem">
              <ProfilePicture
                size={40}
                user={author}
                alt={`${author.username}'s profile picture`}
              />

              <Flex column className={styles.username}>
                <Flex alignItems="center" gap={10}>
                  <Link to={`/users/${author.username}`}>
                    {author.fullName}
                  </Link>
                  {contentAuthors?.includes(author.id) && (
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

            <Flex justifyContent="flex-end">
              {user?.id === author.id && (
                <Tooltip content="Slett kommentar">
                  <Icon
                    danger
                    name="trash"
                    size={20}
                    onClick={() => deleteComment(comment.id, contentTarget)}
                  />
                </Tooltip>
              )}
            </Flex>
          </Flex>
        )}

        <DisplayContent
          id="comment-text"
          className={styles.text}
          content={text ? text : '<p>Slettet</p>'}
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
