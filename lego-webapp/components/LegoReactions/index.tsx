import Reactions from '~/components/Reactions';
import Reaction from '~/components/Reactions/Reaction';
import { useAppSelector } from '~/redux/hooks';
import { selectEmojis } from '~/redux/slices/emojis';
import type { EntityId } from '@reduxjs/toolkit';
import type Emoji from '~/redux/models/Emoji';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { ContentTarget } from '~/utils/contentTarget';

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
  reactionId: EntityId;
};

const LegoReactions = ({ parentEntity, showPeople }: Props) => {
  const emojis = useAppSelector(selectEmojis);
  const fetchingEmojis = useAppSelector((state) => state.emojis.fetching);

  let mappedEmojis: EmojiWithReactionData[] = [];

  if (!fetchingEmojis) {
    mappedEmojis = emojis.map((emoji) => {
      const foundReaction =
        parentEntity.reactionsGrouped &&
        parentEntity.reactionsGrouped.find(
          (reaction) =>
            emoji.shortCode === reaction.emoji && reaction.hasReacted,
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
    <Reactions emojis={mappedEmojis} contentTarget={parentEntity.contentTarget}>
      {parentEntity.reactionsGrouped?.map((reaction) => (
        <Reaction
          key={`reaction-${reaction.emoji}`}
          reaction={{ ...reaction, users: usersByReaction[reaction.emoji] }}
          contentTarget={parentEntity.contentTarget}
          showPeople={showPeople}
        />
      ))}
    </Reactions>
  );
};

export default LegoReactions;
