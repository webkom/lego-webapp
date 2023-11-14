import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  user: CurrentUser;
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
    user,
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    parentEntity,
    loggedIn,
  } = props;
  let mappedEmojis: EmojiWithReactionData[] = [];

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

  const usersByReaction = {};

  if (parentEntity.reactions) {
    for (const reaction of parentEntity.reactions) {
      if (!usersByReaction[reaction.emoji]) {
        usersByReaction[reaction.emoji] = [];
      }
      usersByReaction[reaction.emoji].push(reaction.author);
    }
  }

  return (
    <Reactions
      emojis={mappedEmojis}
      user={user}
      fetchEmojis={fetchEmojis}
      fetchingEmojis={fetchingEmojis}
      addReaction={addReaction}
      deleteReaction={deleteReaction}
      contentTarget={parentEntity.contentTarget}
      loggedIn={loggedIn}
    >
      {parentEntity.reactionsGrouped?.map((reaction) => {
        return (
          <Reaction
            key={`reaction-${reaction.emoji}`}
            emoji={reaction.emoji}
            count={reaction.count}
            users={usersByReaction[reaction.emoji]}
            unicodeString={reaction.unicodeString}
            reactionId={reaction.reactionId}
            user={user}
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
