import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { SmilePlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchEmojis } from '~/redux/actions/EmojiActions';
import { useAppDispatch } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import reactionStyles from './Reaction.module.css';
import ReactionPicker from './ReactionPicker';
import styles from './index.module.css';
import type { ReactNode, SyntheticEvent } from 'react';
import type { EmojiWithReactionData } from '~/components/LegoReactions';
import type { ContentTarget } from '~/utils/contentTarget';

type Props = {
  children: ReactNode;
  className?: string;
  emojis: EmojiWithReactionData[];
  contentTarget: ContentTarget;
};

/**
 *  Note: Most use cases won't want to use this class directly. Instead, use
 *  app/components/LegoReactions.
 */
const Reactions = ({ children, className, emojis, contentTarget }: Props) => {
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [addEmojiHovered, setAddEmojiHovered] = useState(false);
  const [fetchedEmojis, setFetchedEmojis] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const loggedIn = useIsLoggedIn();

  const dispatch = useAppDispatch();

  const toggleReactionPicker = useCallback(
    (e: MouseEvent | SyntheticEvent) => {
      if (!reactionPickerOpen && !fetchedEmojis) {
        dispatch(fetchEmojis());
      }

      setReactionPickerOpen(!reactionPickerOpen);
      setFetchedEmojis(true);
      e.stopPropagation();
    },
    [dispatch, fetchedEmojis, reactionPickerOpen],
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
              styles.addReactionEmojiContainer,
            )}
            onClick={toggleReactionPicker}
            onMouseEnter={() => setAddEmojiHovered(true)}
            onMouseLeave={() => setAddEmojiHovered(false)}
          >
            <Icon
              size={18}
              iconNode={
                <SmilePlus
                  color={
                    addEmojiHovered || reactionPickerOpen
                      ? 'var(--color-orange-6)'
                      : 'var(--placeholder-color)'
                  }
                />
              }
            />
          </Flex>
        )}
      </div>

      {reactionPickerOpen && (
        <div className={styles.reactionPickerContainer}>
          <ReactionPicker emojis={emojis} contentTarget={contentTarget} />
        </div>
      )}
    </div>
  );
};

export default Reactions;
