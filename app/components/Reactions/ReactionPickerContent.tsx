import Emoji from 'app/components/Emoji';
import styles from './ReactionPickerContent.css';
import type { EmojiWithReactionData } from 'app/components/LegoReactions';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './ReactionPickerContent.css';
import { CurrentUser } from 'app/store/models/User';

type Props = {
  emojis: EmojiWithReactionData[];
  user: CurrentUser;
  searchResults: EmojiWithReactionData[] | null;
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
  contentTarget: ContentTarget;
};

const ReactionPickerContent = ({
  emojis,
  user,
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
                      user: user,
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
