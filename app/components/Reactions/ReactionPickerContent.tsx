import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import Emoji from 'app/components/Emoji';
import EmptyState from 'app/components/EmptyState';
import { useCurrentUser } from 'app/reducers/auth';
import { useAppDispatch } from 'app/store/hooks';
import styles from './ReactionPickerContent.css';
import type { EmojiWithReactionData } from 'app/components/LegoReactions';
import type { ContentTarget } from 'app/store/utils/contentTarget';

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
        <EmptyState className={styles.noEmojisFound}>
          Fant ingen emojis{' '}
          <span role="img" aria-label="Emoji">
            😭
          </span>
        </EmptyState>
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
