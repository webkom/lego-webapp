import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import type { ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';

type Props = {
  addReaction: (arg0: { emoji: string; contentTarget: string }) => Promise<any>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<any>;
  fetchEmojis: () => Promise<any>;
  fetchingEmojis: boolean;
  emojis: Array<EmojiEntity>;
  parentEntity: Record<string, any>;
  loggedIn: boolean;
};

const LegoReactions = (props: Props) => {
  const {
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    parentEntity,
    loggedIn,
  } = props;
  let mappedEmojis = [];

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
      fetchEmojis={fetchEmojis}
      fetchingEmojis={fetchingEmojis}
      addReaction={addReaction}
      deleteReaction={deleteReaction}
      contentTarget={parentEntity.contentTarget}
      loggedIn={loggedIn}
    >
      {parentEntity.reactionsGrouped.map((reaction) => {
        return (
          <Reaction
            key={`reaction-${reaction.emoji}`}
            emoji={reaction.emoji}
            count={reaction.count}
            unicodeString={reaction.unicodeString}
            reactionId={reaction.reactionId}
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
