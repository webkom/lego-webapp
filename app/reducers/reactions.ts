import { Reaction } from 'app/actions/ActionTypes';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import getEntityType from 'app/utils/getEntityType';
import type { AnyAction } from '@reduxjs/toolkit';

type ReactionState = {
  byId: { reactionsGrouped?: ReactionsGrouped[] }[];
};

export function mutateReactions<S extends ReactionState>(
  forTargetType: string
) {
  return (state: S, action: AnyAction) => {
    switch (action.type) {
      case Reaction.ADD.SUCCESS: {
        const [serverTargetType, targetId] =
          action.meta.contentTarget.split('-');
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
                .map((reaction) => {
                  if (reaction.emoji !== reactionEmoji) {
                    return reaction;
                  }

                  found = true;
                  return {
                    ...reaction,
                    count: reaction.count + 1,
                    hasReacted: true,
                    reactionId,
                  };
                })
                .concat(
                  !found
                    ? {
                        count: 1,
                        emoji: reactionEmoji,
                        hasReacted: true,
                        reactionId: reactionId,
                        unicodeString,
                      }
                    : []
                ),
            },
          },
        };
      }

      case Reaction.DELETE.SUCCESS: {
        const [serverTargetType, targetId] =
          action.meta.contentTarget.split('-');
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
                .map((reaction) => {
                  if (reaction.reactionId !== reactionId) {
                    return reaction;
                  }

                  return {
                    ...reaction,
                    count: reaction.count - 1,
                    hasReacted: false,
                  };
                })
                .filter((reaction) => reaction.count !== 0),
            },
          },
        };
      }

      default: {
        return state;
      }
    }
  };
}
