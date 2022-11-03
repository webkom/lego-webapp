import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import styles from './ReactionPickerContent.css';
import Emoji from 'app/components/Emoji';
type Props = {
  emojis: Array<EmojiEntity>;
  searchResults: Array<EmojiEntity> | null;
  addReaction: (arg0: { emoji: string; contentTarget: string }) => Promise<any>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<any>;
  contentTarget: string;
};

const ReactionPickerContent = ({
  emojis,
  searchResults,
  addReaction,
  deleteReaction,
  contentTarget,
}: Props) => (
  <div className={styles.ReactionPickerContentContainer}>
    {searchResults !== null && searchResults.length === 0 ? (
      <div className={styles.noEmojisFound}>
        Fant ingen emojis{' '}
        <span role="img" aria-label="Emoji">
          😭
        </span>
      </div>
    ) : (
      <div className={styles.reactionPickerContent}>
        {(searchResults !== null ? searchResults : emojis).map(
          (emoji: EmojiEntity) => (
            <div
              key={emoji.shortCode}
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
              <div
                className={styles.reactionPickerItemContainer}
                title={emoji.shortCode}
              >
                <div>
                  <Emoji
                    size="22px"
                    id={emoji.shortCode}
                    unicodeString={emoji.unicodeString}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    )}
  </div>
);

export default ReactionPickerContent;
