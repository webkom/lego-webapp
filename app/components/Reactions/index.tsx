import classNames from 'classnames';
import { Component } from 'react';
import type { ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import reactionStyles from './Reaction.css';
import ReactionPicker from './ReactionPicker';
import AddReactionEmoji from './assets/AddReactionEmoji';
import styles from './index.css';
import type { ReactNode, MouseEventHandler, RefObject } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  emojis: Array<EmojiEntity>;
  fetchingEmojis: boolean;
  addReaction: (arg0: {
    emoji: string;
    contentTarget: string;
  }) => Promise<void>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  contentTarget: string;
  loggedIn: boolean;
};
type State = {
  hovered: boolean;
  addEmojiHovered: boolean;
  reactionPickerOpen: boolean;
  fetchedEmojis: boolean;
}; // Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

class Reactions extends Component<Props, State> {
  node: RefObject<HTMLDivElement>;

  state = {
    hovered: false,
    addEmojiHovered: false,
    reactionPickerOpen: false,
    fetchedEmojis: false,
  };
  onMouseEnter = () => {
    this.setState({
      hovered: true,
    });
  };
  onMouseLeave = () => {
    this.setState({
      hovered: false,
    });
  };
  onAddEmojiEnter = () => {
    this.setState({
      addEmojiHovered: true,
    });
  };
  onAddEmojiLeave = () => {
    this.setState({
      addEmojiHovered: false,
    });
  };
  toggleReactionPicker: MouseEventHandler<HTMLDivElement> = (e) => {
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
      fetchedEmojis: true,
    });
    e.stopPropagation();
  };

  handleOutsideClick = (e) => {
    if (this.node?.current?.contains(e.target)) {
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
      contentTarget,
      loggedIn,
    } = this.props;
    const { reactionPickerOpen, addEmojiHovered } = this.state;
    return (
      <div className={styles.reactionsContainer} ref={this.node}>
        <div
          className={className ? className : styles.reactions}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {children}
          {loggedIn && (
            <div
              className={classNames(
                reactionStyles.reaction,
                styles.addReactionEmojiContainer
              )}
              onClick={this.toggleReactionPicker}
              onMouseEnter={this.onAddEmojiEnter}
              onMouseLeave={this.onAddEmojiLeave}
            >
              <AddReactionEmoji
                color={addEmojiHovered ? '#E20D13' : '#F7A4A6'}
              />
            </div>
          )}
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
