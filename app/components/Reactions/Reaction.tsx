import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './Reaction.css';

type Props = {
  className?: string;
  userId: ID;
  emoji: string;
  count: number;
  users: { fullName: string }[] | null;
  unicodeString: string;
  addReaction: (args: {
    emoji: string;
    userId: ID;
    contentTarget: ContentTarget;
    unicodeString?: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    userId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  hasReacted: boolean;
  canReact: boolean;
  reactionId: ID;
  contentTarget: ContentTarget;
};
// Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

const Reaction = ({
  className,
  userId,
  emoji,
  count,
  users,
  unicodeString,
  addReaction,
  deleteReaction,
  hasReacted,
  canReact,
  reactionId,
  contentTarget,
}: Props) => {
  const classes = [
    className ? className : styles.reaction,
    canReact && styles.clickable,
  ];

  if (hasReacted) {
    classes.push(styles.reacted);
  }

  if (count === 0) {
    return <></>;
  }

  let tooltipContent = emoji + '\n';
  if (users) {
    tooltipContent += users.map((user) => user.fullName).join(', ');
  }

  console.log("User id in reaction", userId)

  return (
    <>
      <Tooltip content={tooltipContent}>
        <Flex
          gap={4}
          justifyContent="center"
          alignItems="center"
          className={cx(classes)}
          onClick={
            canReact
              ? () =>
                  hasReacted
                    ? deleteReaction({
                        reactionId,
                        userId: userId,
                        contentTarget: contentTarget,
                      })
                    : addReaction({
                        emoji,
                        userId: userId,
                        contentTarget,
                        unicodeString,
                      })
              : null
          }
        >
          <div>
            <Emoji unicodeString={unicodeString} />
          </div>
          <span className={styles.reactionCount}>{count}</span>
        </Flex>
      </Tooltip>
    </>
  );
};

export default Reaction;
