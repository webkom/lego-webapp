import cx from 'classnames';
import { Component } from 'react';
import Emoji from 'app/components/Emoji';
import Flex from 'app/components/Layout/Flex';
import Tooltip from 'app/components/Tooltip';
import type { ID } from 'app/models';
import styles from './Reaction.css';

type Props = {
  className?: string;
  emoji: string;
  count: number;
  unicodeString: string;
  addReaction: (arg0: {
    emoji: string;
    contentTarget: string;
    unicodeString?: string;
  }) => Promise<void>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<void>;
  hasReacted: boolean;
  canReact: boolean;
  reactionId: ID;
  contentTarget: string;
}; // Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

class Reaction extends Component<Props> {
  render() {
    const {
      className,
      emoji,
      count,
      unicodeString,
      addReaction,
      deleteReaction,
      hasReacted,
      canReact,
      reactionId,
      contentTarget,
    } = this.props;
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
                      ? deleteReaction({
                          reactionId,
                          contentTarget: contentTarget,
                        })
                      : addReaction({
                          emoji,
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
  }
}

export default Reaction;
