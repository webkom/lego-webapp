import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import { selectEmojis } from 'app/reducers/emojis';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppSelector } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  parentEntity: {
    contentTarget: ContentTarget;
    reactionsGrouped?: ReactionsGrouped[];
    reactions?: { author: { fullName: string }; emoji: string }[];
  };
  showPeople?: boolean;
};

export type EmojiWithReactionData = Emoji & {
  hasReacted: boolean;
  reactionId: ID;
};

const LegoReactions = ({ parentEntity, showPeople }: Props) => {
  const emojis = useAppSelector(selectEmojis);
  const fetchingEmojis = useAppSelector((state) => state.emojis.fetching);
  const { loggedIn } = useUserContext();

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
            hasReacted={reaction.hasReacted}
            canReact={loggedIn}
            contentTarget={parentEntity.contentTarget}
            showPeople={showPeople}
          />
        );
      })}
    </Reactions>
  );
};

export default LegoReactions;
