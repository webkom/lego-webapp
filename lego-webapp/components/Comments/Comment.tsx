import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { Reply, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import CommentForm from '~/components/CommentForm';
import DisplayContent from '~/components/DisplayContent';
import { ProfilePicture } from '~/components/Image';
import { Tag } from '~/components/Tags';
import Time from '~/components/Time';
import Tooltip from '~/components/Tooltip';
import { deleteComment } from '~/redux/actions/CommentActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import LegoReactions from '../LegoReactions';
import styles from './Comment.module.css';
import type CommentType from '~/redux/models/Comment';
import type { ContentAuthors } from '~/redux/models/Comment';
import type { ContentTarget } from '~/utils/contentTarget';

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
              <a href={`/users/${author.username}`}>
                <ProfilePicture size={40} user={author} />
              </a>

              <Flex column className={styles.username}>
                <Flex alignItems="center" gap="var(--spacing-sm)">
                  <a href={`/users/${author.username}`}>{author.fullName}</a>
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
