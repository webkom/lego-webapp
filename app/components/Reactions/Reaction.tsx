import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './Reaction.css';

type Props = {
  className?: string;
  emoji: string;
  count: number;
  unicodeString: string;
  hasReacted: boolean;
  canReact: boolean;
  reactionId: ID;
  contentTarget: ContentTarget;
};
// Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

const Reaction = ({
  className,
  emoji,
  count,
  unicodeString,
  hasReacted,
  canReact,
  reactionId,
  contentTarget,
}: Props) => {
  const dispatch = useAppDispatch();

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

  return (
    <>
      <Tooltip content={emoji}>
        <Flex
          gap={4}
          justifyContent="center"
          alignItems="center"
          className={cx(classes)}
          onClick={
            canReact
              ? () =>
                  hasReacted
                    ? dispatch(
                        deleteReaction({
                          reactionId,
                          contentTarget: contentTarget,
                        })
                      )
                    : dispatch(
                        addReaction({
                          emoji,
                          contentTarget,
                          unicodeString,
                        })
                      )
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
