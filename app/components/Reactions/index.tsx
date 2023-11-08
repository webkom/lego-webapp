import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import reactionStyles from './Reaction.css';
import ReactionPicker from './ReactionPicker';
import AddReactionEmoji from './assets/AddReactionEmoji';
import styles from './index.css';
import type { EmojiWithReactionData } from 'app/components/LegoReactions';
import type { ID } from 'app/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { ReactNode, SyntheticEvent } from 'react';
import { CurrentUser } from 'app/store/models/User';

type Props = {
  user: CurrentUser;
  children: ReactNode;
  className?: string;
  emojis: EmojiWithReactionData[];
  fetchingEmojis: boolean;
  addReaction: (args: {
    emoji: string;
    user: CurrentUser;
    contentTarget: ContentTarget;
    unicodeString: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  contentTarget: ContentTarget;
  loggedIn: boolean;
};

// Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

const Reactions = ({
  user,
  children,
  className,
  emojis,
  fetchingEmojis,
  addReaction,
  deleteReaction,
  fetchEmojis,
  contentTarget,
  loggedIn,
}: Props) => {
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [addEmojiHovered, setAddEmojiHovered] = useState(false);
  const [fetchedEmojis, setFetchedEmojis] = useState(false);
  const nodeRef = useRef<HTMLDivElement>();

  const toggleReactionPicker = useCallback(
    (e: MouseEvent | SyntheticEvent) => {
      if (!reactionPickerOpen && !fetchedEmojis) {
        fetchEmojis();
      }

      setReactionPickerOpen(!reactionPickerOpen);
      setFetchedEmojis(true);
      e.stopPropagation();
    },
    [fetchEmojis, fetchedEmojis, reactionPickerOpen]
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        nodeRef.current &&
        e.target instanceof Node &&
        nodeRef.current.contains(e.target)
      ) {
        return;
      }
      toggleReactionPicker(e);
    };

    if (reactionPickerOpen) {
      document.addEventListener('click', handleOutsideClick, false);
      return () =>
        document.removeEventListener('click', handleOutsideClick, false);
    }
  }, [reactionPickerOpen, toggleReactionPicker]);

  return (
    <div className={styles.reactionsContainer} ref={nodeRef}>
      <div className={className ? className : styles.reactions}>
        {children}
        {loggedIn && (
          <Flex
            alignItems="center"
            justifyContent="center"
            className={cx(
              reactionStyles.reaction,
              styles.addReactionEmojiContainer
            )}
            onClick={toggleReactionPicker}
            onMouseEnter={() => setAddEmojiHovered(true)}
            onMouseLeave={() => setAddEmojiHovered(false)}
          >
            <AddReactionEmoji
              color={
                addEmojiHovered || reactionPickerOpen
                  ? 'var(--color-orange-6)'
                  : 'var(--color-gray-5)'
              }
            />
          </Flex>
        )}
      </div>

      {reactionPickerOpen && (
        <div className={styles.reactionPickerContainer}>
          <ReactionPicker
            emojis={emojis}
            user={user}
            isLoading={fetchingEmojis}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            contentTarget={contentTarget}
          />
        </div>
      )}
    </div>
  );
};

export default Reactions;
