// @flow

import { Reaction } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import getEntityType from 'app/utils/getEntityType';
import type { ID } from 'app/models';

export type ReactionEntity = {
  reactionId: ID,
  emoji: string,
  unicodeString: string,
  count: number,
  hasReacted?: boolean
};

export function mutateReactions(forTargetType: string) {
  return (state: any, action: any) => {
    switch (action.type) {
      case Reaction.ADD.SUCCESS: {
        const [serverTargetType, targetId] = action.meta.contentTarget.split(
          '-'
        );

        const reactionEmoji = action.meta.emoji;
        const unicodeString = action.meta.unicodeString;
        const reactionId = action.payload.result;

        const targetType = getEntityType(serverTargetType);
        if (targetType !== forTargetType) {
          return state;
        }

        let found = false;

        return {
          ...state,
          byId: {
            ...state.byId,
            [targetId]: {
              ...state.byId[targetId],
              reactionsGrouped: state.byId[targetId].reactionsGrouped
                .map(reaction => {
                  if (reaction.emoji !== reactionEmoji) {
                    return reaction;
                  }
                  reaction.count += 1;
                  reaction.hasReacted = true;
                  reaction.reactionId = reactionId;
                  found = true;
                  return reaction;
                })
                .concat(
                  !found
                    ? {
                        count: 1,
                        emoji: reactionEmoji,
                        hasReacted: true,
                        reactionId: reactionId,
                        unicodeString
                      }
                    : []
                )
                .sort((a, b) => b.count - a.count)
            }
          }
        };
      }

      case Reaction.DELETE.SUCCESS: {
        const [serverTargetType, targetId] = action.meta.contentTarget.split(
          '-'
        );
        const reactionId = action.meta.id;
        const targetType = getEntityType(serverTargetType);
        if (targetType !== forTargetType) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [targetId]: {
              ...state.byId[action.meta.id],
              ...state.byId[targetId],
              reactionsGrouped: state.byId[targetId].reactionsGrouped
                .map(reaction => {
                  if (reaction.reactionId !== reactionId) {
                    return reaction;
                  }
                  reaction.count -= 1;
                  reaction.hasReacted = false;
                  return reaction;
                })
                .filter(reaction => reaction.count !== 0)
                .sort((a, b) => b.count - a.count)
            }
          }
        };
      }

      default: {
        return state;
      }
    }
  };
}

export default createEntityReducer({
  key: 'reactions',
  types: {},
  mutateReactions
});
