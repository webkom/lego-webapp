import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  userId: ID;
  addReaction: (args: {
    emoji: string;
    userId: ID;
    contentTarget: ContentTarget;
    unicodeString: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    userId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
  parentEntity: {
    contentTarget: ContentTarget;
    reactionsGrouped?: ReactionsGrouped[];
    reactions?: { author: { fullName: string }; emoji: string }[];
  };
  loggedIn: boolean;
};

export type EmojiWithReactionData = Emoji & {
  hasReacted: boolean;
  reactionId: ID;
};

const LegoReactions = (props: Props) => {
  const {
    userId,
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    parentEntity,
    loggedIn,
  } = props;
  let mappedEmojis: EmojiWithReactionData[] = [];

  console.log(parentEntity)

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

  let usersByReaction = {};

  if (parentEntity.reactionsGrouped && parentEntity.reactions) {
    for (let groupedReaction of parentEntity.reactionsGrouped) {
      for (let reaction of parentEntity.reactions) {
        if (reaction.emoji === groupedReaction.emoji) {
          if (!usersByReaction[reaction.emoji]) {
            usersByReaction[reaction.emoji] = [];
          }
          usersByReaction[reaction.emoji].push(reaction.author);
        }
      }
    }
  }

  return (
    <Reactions
      emojis={mappedEmojis}
      fetchEmojis={fetchEmojis}
      fetchingEmojis={fetchingEmojis}
      addReaction={addReaction}
      deleteReaction={deleteReaction}
      contentTarget={parentEntity.contentTarget}
      loggedIn={loggedIn}
    >
      {parentEntity.reactionsGrouped && parentEntity.reactionsGrouped.map((reaction) => {
        return (
          <Reaction
            key={`reaction-${reaction.emoji}`}
            emoji={reaction.emoji}
            count={reaction.count}
            users={usersByReaction[reaction.emoji]}
            unicodeString={reaction.unicodeString}
            reactionId={reaction.reactionId}
            userId={userId}
            hasReacted={reaction.hasReacted}
            canReact={loggedIn}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            contentTarget={parentEntity.contentTarget}
          />
        );
      })}
    </Reactions>
  );
};

export default LegoReactions;
