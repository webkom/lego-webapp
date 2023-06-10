import Emoji from 'app/components/Emoji';
import type { EmojiWithReactionData } from 'app/components/LegoReactions';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './ReactionPickerContent.module.css';

type Props = {
  emojis: EmojiWithReactionData[];
  searchResults: EmojiWithReactionData[] | null;
  addReaction: (args: {
    emoji: string;
    contentTarget: ContentTarget;
    unicodeString: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  contentTarget: ContentTarget;
};

const ReactionPickerContent = ({
  emojis,
  searchResults,
  addReaction,
  deleteReaction,
  contentTarget,
}: Props) => (
  <div className={styles.container}>
    {searchResults !== null && searchResults.length === 0 ? (
      <div className={styles.noEmojisFound}>
        Fant ingen emojis{' '}
        <span role="img" aria-label="Emoji">
          😭
        </span>
      </div>
    ) : (
      <div className={styles.content}>
        {(searchResults !== null ? searchResults : emojis).map(
          (emoji: EmojiWithReactionData) => (
            <div
              key={emoji.shortCode}
              className={styles.emoji}
              onClick={() =>
                emoji.hasReacted && emoji.reactionId
                  ? deleteReaction({
                      reactionId: emoji.reactionId,
                      contentTarget,
                    })
                  : addReaction({
                      emoji: emoji.shortCode,
                      contentTarget,
                      unicodeString: emoji.unicodeString,
                    })
              }
            >
              <Emoji size="22px" unicodeString={emoji.unicodeString} />
            </div>
          )
        )}
      </div>
    )}
  </div>
);

export default ReactionPickerContent;
