import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useCallback } from 'react';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Reaction.css';
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

  const dispatch = useAppDispatch();

  const { currentUser, loggedIn } = useUserContext();
  const canReact = loggedIn;

  const classNames = cx({
    [className || styles.reaction]: true,
    [styles.clickable]: canReact,
    [styles.reacted]: hasReacted,
  });

  const handleReaction = useCallback(() => {
    if (!canReact) {
      return;
    }

    if (hasReacted) {
      dispatch(deleteReaction({ reactionId, contentTarget }));
    } else {
      dispatch(
        addReaction({ emoji, user: currentUser, contentTarget, unicodeString })
      );
    }
  }, [
    canReact,
    hasReacted,
    dispatch,
    reactionId,
    contentTarget,
    emoji,
    currentUser,
    unicodeString,
  ]);

  if (count === 0) {
    return <></>;
  }

  let tooltipContent =
    showPeople && users?.map((user) => user.fullName).join(', ');
  tooltipContent = tooltipContent ? `${tooltipContent} reagerte med ` : '';
  tooltipContent += emoji;

  return (
    <>
      <Tooltip content={tooltipContent}>
        <Flex
          gap={4}
          justifyContent="center"
          alignItems="center"
          className={classNames}
          onClick={handleReaction}
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
