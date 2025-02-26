import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { Reply, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'react-router';
import { deleteComment } from 'app/actions/CommentActions';
import CommentForm from 'app/components/CommentForm';
import DisplayContent from 'app/components/DisplayContent';
import { ProfilePicture } from 'app/components/Image';
import { Tag } from 'app/components/Tags';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser } from 'app/reducers/auth';
import { useAppDispatch } from 'app/store/hooks';
import LegoReactions from '../LegoReactions';
import styles from './Comment.module.css';
import type CommentType from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  comment: CommentType;
  commentFormProps: {
    contentTarget: ContentTarget;
  };
  contentTarget: ContentTarget;
  contentAuthors?: ContentAuthors;
};

const Comment = ({
  comment,
  contentTarget,
  commentFormProps,
  contentAuthors,
}: Props) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const { createdAt, text, author } = comment;

  const dispatch = useAppDispatch();

  const currentUser = useCurrentUser();

  return (
    <>
      <div className={styles.comment}>
        {author ? (
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap="var(--spacing-md)">
              <Link to={`/users/${author.username}`}>
                <ProfilePicture size={40} user={author} />
              </Link>

              <Flex column className={styles.username}>
                <Flex alignItems="center" gap="var(--spacing-sm)">
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
                <Tooltip
                  content={moment(createdAt).format('lll')}
                  positions="right"
                  className={styles.timestampTooltip}
                >
                  <Time
                    className={styles.timestamp}
                    time={createdAt}
                    wordsAgo
                  />
                </Tooltip>
              </Flex>
            </Flex>

            {currentUser?.id === author.id && (
              <Flex justifyContent="flex-end">
                <Tooltip content="Slett kommentar">
                  <Icon
                    danger
                    iconNode={<Trash2 />}
                    size={20}
                    onPress={() =>
                      dispatch(deleteComment(comment.id, contentTarget))
                    }
                    data-test-id="delete-comment-button"
                  />
                </Tooltip>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap="var(--spacing-md)">
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

        <LegoReactions
          parentEntity={{
            ...comment,
            contentTarget: comment.contentTargetSelf,
          }}
        />

        {author && (
          <Button flat onPress={() => setReplyOpen(!replyOpen)}>
            {replyOpen ? (
              'Avbryt'
            ) : (
              <>
                <Icon iconNode={<Reply />} size={20} />
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
          placeholder={`Svar ${author?.fullName} ...`}
        />
      )}
    </>
  );
};

export default Comment;
