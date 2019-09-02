// @flow

import React from 'react';
import classNames from 'classnames';
import Tooltip from 'app/components/Tooltip';
import type { ID } from 'app/models';
import styles from './Reaction.css';
import Emoji from 'app/components/Emoji';

type Props = {
  className?: string,
  emoji: string,
  count: number,
  unicodeString: string,
  addReaction: ({
    emoji: string,
    contentTarget: string
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  hasReacted: boolean,
  reactionId: number,
  contentTarget: string
};

class Reaction extends React.Component<Props> {
  render() {
    const {
      className,
      emoji,
      count,
      unicodeString,
      addReaction,
      deleteReaction,
      hasReacted,
      reactionId,
      contentTarget
    }: Props = this.props;
    const classes = [className ? className : styles.reaction];

    if (hasReacted) {
      classes.push(styles.reacted);
    }

    if (count === 0) {
      return <></>;
    }

    return (
      <div>
        <Tooltip content={emoji}>
          <div
            className={classNames(classes)}
            onClick={() =>
              hasReacted
                ? deleteReaction({ reactionId, contentTarget: contentTarget })
                : addReaction({
                    emoji,
                    contentTarget,
                    unicodeString
                  })
            }
          >
            <div className={styles.reactionIcon}>
              <Emoji id={emoji} unicodeString={unicodeString} />
            </div>
            <div className={styles.reactionCount}>{count}</div>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default Reaction;
