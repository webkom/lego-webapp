import Emoji from '~/components/Emoji';
import EmptyState from '~/components/EmptyState';
import { addReaction, deleteReaction } from '~/redux/actions/ReactionActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './ReactionPickerContent.module.css';
import type { EmojiWithReactionData } from '~/components/LegoReactions';
import type { ContentTarget } from '~/utils/contentTarget';

type Props = {
  emojis: EmojiWithReactionData[];
  searchResults: EmojiWithReactionData[] | null;
  contentTarget: ContentTarget;
};

const ReactionPickerContent = ({
  emojis,
  searchResults,
  contentTarget,
}: Props) => {
  const dispatch = useAppDispatch();

  const currentUser = useCurrentUser();

  return (
    <div className={styles.container}>
      {searchResults !== null && searchResults.length === 0 ? (
        <EmptyState
          body="Fant ingen emojis 😭"
          className={styles.noEmojisFound}
        />
      ) : (
        <div className={styles.content}>
          {(searchResults !== null ? searchResults : emojis).map(
            (emoji: EmojiWithReactionData) => (
              <div
                key={emoji.shortCode}
                className={styles.emoji}
                onClick={() =>
                  emoji.hasReacted && emoji.reactionId
                    ? dispatch(
                        deleteReaction({
                          reactionId: emoji.reactionId,
                          contentTarget,
                        }),
                      )
                    : dispatch(
                        addReaction({
                          emoji: emoji.shortCode,
                          user: currentUser,
                          contentTarget,
                          unicodeString: emoji.unicodeString,
                        }),
                      )
                }
              >
                <Emoji size="22px" unicodeString={emoji.unicodeString} />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionPickerContent;
