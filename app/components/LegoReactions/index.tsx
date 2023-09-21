import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import { useAppSelector } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  emojis: Emoji[];
  parentEntity: {
    contentTarget: ContentTarget;
    reactionsGrouped?: ReactionsGrouped[];
  };
  loggedIn: boolean;
};

export type EmojiWithReactionData = Emoji & {
  hasReacted: boolean;
  reactionId: ID;
};

const LegoReactions = (props: Props) => {
  const { emojis, parentEntity, loggedIn } = props;
  let mappedEmojis: EmojiWithReactionData[] = [];

  const fetchingEmojis = useAppSelector((state) => state.emojis.fetching);

  if (!fetchingEmojis) {
    mappedEmojis = emojis.map((emoji) => {
      const foundReaction =
        parentEntity.reactionsGrouped &&
        parentEntity.reactionsGrouped.find(
          (reaction) =>
            emoji.shortCode === reaction.emoji && reaction.hasReacted
        );
      return {
        ...emoji,
        hasReacted: !!foundReaction,
        reactionId: foundReaction ? foundReaction.reactionId : -1,
      };
    });
  }

  return (
    <Reactions
      emojis={mappedEmojis}
      contentTarget={parentEntity.contentTarget}
      loggedIn={loggedIn}
    >
      {parentEntity.reactionsGrouped?.map((reaction) => {
        return (
          <Reaction
            key={`reaction-${reaction.emoji}`}
            emoji={reaction.emoji}
            count={reaction.count}
            unicodeString={reaction.unicodeString}
            reactionId={reaction.reactionId}
            hasReacted={reaction.hasReacted}
            canReact={loggedIn}
            contentTarget={parentEntity.contentTarget}
          />
        );
      })}
    </Reactions>
  );
};

export default LegoReactions;
