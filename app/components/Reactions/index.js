// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';
import styles from './index.css';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import reactionStyles from './Reaction.css';
import ReactionPicker from './ReactionPicker';

type Props = {
  children: Node,
  className?: string,
  emojis: Array<EmojiEntity>,
  fetchingEmojis: boolean,
  addReaction: ({
    emoji: string,
    contentTarget: string
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  contentTarget: string
};

type State = {
  hovered: boolean,
  reactionPickerOpen: boolean,
  fetchedEmojis: boolean
};

class Reactions extends React.Component<Props, State> {
  node: ?any = null;

  state = {
    hovered: false,
    reactionPickerOpen: false,
    fetchedEmojis: false
  };

  constructor() {
    super();

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  onMouseEnter = () => {
    this.setState({
      hovered: true
    });
  };

  onMouseLeave = () => {
    this.setState({
      hovered: false
    });
  };

  toggleReactionPicker = (e: Event) => {
    if (!this.state.reactionPickerOpen) {
      if (!this.state.fetchedEmojis) {
        this.props.fetchEmojis();
      }
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState({
      reactionPickerOpen: !this.state.reactionPickerOpen,
      fetchedEmojis: true
    });
    e.stopPropagation();
  };

  handleOutsideClick = (e: Event) => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.toggleReactionPicker(e);
  };

  render() {
    const {
      children,
      className,
      emojis,
      fetchingEmojis,
      addReaction,
      deleteReaction,
      contentTarget
    } = this.props;
    const { reactionPickerOpen } = this.state;
    return (
      <div
        className={styles.reactionsContainer}
        ref={node => {
          this.node = node;
        }}
      >
        <div
          className={className ? className : styles.reactions}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {children}
          <div
            className={classNames(reactionStyles.reaction, styles.addReaction)}
            onClick={this.toggleReactionPicker}
          >
            <span role="img" aria-label="Add">
              ➕
            </span>
          </div>
        </div>
        {reactionPickerOpen && (
          <div className={styles.reactionPickerContainer}>
            <ReactionPicker
              emojis={emojis}
              isLoading={fetchingEmojis}
              addReaction={addReaction}
              deleteReaction={deleteReaction}
              contentTarget={contentTarget}
            />
          </div>
        )}
      </div>
    );
  }
}
export default Reactions;
