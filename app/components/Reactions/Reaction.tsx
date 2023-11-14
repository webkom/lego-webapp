import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import styles from './Reaction.css';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import { CurrentUser } from 'app/store/models/User';

type Props = {
  className?: string;
  user: CurrentUser;
  emoji: string;
  count: number;
  users?: { fullName: string }[];
  unicodeString: string;
  addReaction: (args: {
    emoji: string;
    user: CurrentUser;
    contentTarget: ContentTarget;
    unicodeString?: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
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
  user,
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

  let tooltipContent = '';
  if (users && users.length > 0) {
    tooltipContent += users.map((user) => user.fullName).join(', ');
    tooltipContent += ' reagerte med ';
  }

  tooltipContent += emoji;

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
                        user: user,
                        contentTarget: contentTarget,
                      })
                    : addReaction({
                        emoji,
                        user: user,
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
