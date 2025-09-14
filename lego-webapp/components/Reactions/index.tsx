import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { SmilePlus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { fetchEmojis } from '~/redux/actions/EmojiActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import reactionStyles from './Reaction.module.css';
import ReactionPicker from './ReactionPicker';
import styles from './index.module.css';
import type { ReactNode } from 'react';
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

  const loggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const hasFetchedAll = useAppSelector((state) => state.emojis.hasFetchedAll);

  // Only fetch emojis if they haven't been fetched yet.
  // This prioritizes performance and user experience
  // at the cost of potentially stale data (until redux is refreshed).
  const initialFetchEmojis = useCallback(() => {
    if (!hasFetchedAll) dispatch(fetchEmojis());
  }, [dispatch, hasFetchedAll]);

  return (
    <div className={styles.reactionsContainer}>
      <div className={className ? className : styles.reactions}>
        {/* Reactions */}
        {children}

        {/* New reaction */}
        {loggedIn && (
          <DialogTrigger
            onOpenChange={(isOpen) => {
              setReactionPickerOpen(isOpen);
              initialFetchEmojis();
            }}
          >
            <Button
              className={cx(
                reactionStyles.reaction,
                styles.addReactionEmojiContainer,
              )}
            >
              {({ isHovered }) => (
                <Icon
                  size={18}
                  iconNode={
                    <SmilePlus
                      color={
                        isHovered || reactionPickerOpen
                          ? 'var(--color-orange-6)'
                          : 'var(--placeholder-color)'
                      }
                    />
                  }
                />
              )}
            </Button>

            <Popover placement="top">
              <Dialog>
                <div className={styles.reactionPickerContent}>
                  <ReactionPicker
                    emojis={emojis}
                    contentTarget={contentTarget}
                  />
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        )}
      </div>
    </div>
  );
};

export default Reactions;
