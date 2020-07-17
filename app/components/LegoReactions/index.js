// @flow

import React from 'react';
import Reaction from 'app/components/Reactions/Reaction';
import Reactions from 'app/components/Reactions';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';

type Props = {
  addReaction: ({
    emoji: string,
    contentTarget: string,
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
  parentEntity: Object,
};

const LegoReactions = (props: Props) => {
  const {
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    parentEntity,
  } = props;

  let mappedEmojis = [];
  if (!fetchingEmojis) {
    mappedEmojis = emojis.map((emoji) => {
      const foundReaction =
        parentEntity.reactionsGrouped &&
        parentEntity.reactionsGrouped.find(
          (reaction) => emoji.shortCode == reaction.emoji && reaction.hasReacted
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
