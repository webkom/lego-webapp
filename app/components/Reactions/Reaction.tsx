import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Reaction.module.css';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  className?: string;
  reaction: ReactionsGrouped;
  contentTarget: ContentTarget;
  showPeople?: boolean;
};

/**
 *  Note: Most use cases won't want to use this class directly. Instead, use
 *  app/components/LegoReactions.
 */
const Reaction = ({
  className,
  reaction,
  contentTarget,
  showPeople,
}: Props) => {
  const { emoji, count, unicodeString, hasReacted, reactionId, users } =
    reaction;

  const [optimisticCount, setOptimisticCount] = useState(count);
  const [optimisticHasReacted, setOptimisticHasReacted] = useState(hasReacted);
  const [optimisticUsers, setOptimisticUsers] = useState(users);

  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();
  const canReact = loggedIn && currentUser;

  const classNames = cx({
    [className || styles.reaction]: true,
    [styles.clickable]: canReact,
    [styles.reacted]: optimisticHasReacted,
  });

  const dispatch = useAppDispatch();

  const optimisticAdd = () => {
    setOptimisticCount((count) => count + 1);
    setOptimisticHasReacted(true);
    setOptimisticUsers((users) => [...(users || []), currentUser]);
  };

  const optimisticRemove = () => {
    setOptimisticCount((count) => count - 1);
    setOptimisticHasReacted(false);
    setOptimisticUsers((users) =>
      users?.filter((user) => user.id !== currentUser?.id),
    );
  };

  const handleReaction = () => {
    if (!canReact) {
      return;
    }

    if (optimisticHasReacted) {
      optimisticRemove();
      hasReacted &&
        dispatch(deleteReaction({ reactionId, contentTarget })).catch(() => {
          optimisticAdd();
        });
    } else {
      optimisticAdd();
      !hasReacted &&
        dispatch(
          addReaction({
            emoji,
            user: currentUser,
            contentTarget,
            unicodeString,
          }),
        ).catch(() => {
          optimisticRemove();
        });
    }
  };

  if (optimisticCount === 0) {
    return <></>;
  }

  const tooltipContentNames =
    showPeople &&
    optimisticUsers
      ?.map((user) => user.fullName)
      .sort()
      .map((name) => <div key={name}>{name}</div>);
  const tooltipContent = tooltipContentNames ? (
    <div>
      {tooltipContentNames}
      <p>har reagert med {emoji}</p>
    </div>
  ) : undefined;

  return (
    <Tooltip content={tooltipContent}>
      <Flex
        gap="var(--spacing-xs)"
        justifyContent="center"
        alignItems="center"
        className={classNames}
        onClick={handleReaction}
      >
        <div>
          <Emoji unicodeString={unicodeString} />
        </div>
        <span className={styles.reactionCount}>{optimisticCount}</span>
      </Flex>
    </Tooltip>
  );
};

export default Reaction;
