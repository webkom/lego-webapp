import type { ID } from 'app/store/models';
import { Reaction } from 'app/actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { EntityReducerState } from 'app/utils/createEntityReducer';
import getEntityType from 'app/utils/getEntityType';

type WithReactions<T> = T & { reactionsGrouped: ReactionsGrouped[] };

type StateWithReactions<T, S> = S & {
  byId: Record<ID, WithReactions<T>>;
};

export function mutateReactions<T, S = EntityReducerState<T>>(
  forTargetType: string
) {
  return (state: StateWithReactions<T, S>, action: AnyAction) => {
    switch (action.type) {
      case Reaction.ADD.SUCCESS: {
        const [serverTargetType, targetId] =
          action.meta.contentTarget.split('-');
        const reactionEmoji = action.meta.emoji;
        const unicodeString = action.meta.unicodeString;
        const reactionId = action.payload.id;
        const targetType = getEntityType(serverTargetType);
        const user = action.meta.user;

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
              reactions: (state.byId[targetId].reactions || []).concat({
                author: user,
                emoji: reactionEmoji,
                reactionId: reactionId,
                unicodeString,
              }),
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
              reactions: (state.byId[targetId].reactions || []).filter(
                (reaction) => {
                  return reaction.reactionId !== reactionId;
                }
              ),
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
