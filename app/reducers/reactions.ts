import { Reaction } from 'app/actions/ActionTypes';
import { parseContentTarget } from 'app/store/utils/contentTarget';
import getEntityType from 'app/utils/getEntityType';
import type { AnyAction } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { ID } from 'app/store/models';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { EntityType } from 'app/store/models/entities';
import type { EntityReducerState } from 'app/utils/createEntityReducer';

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

export const addReactionCases = (
  forTargetType: EntityType,
  addCase: ActionReducerMapBuilder<
    EntityState<{ reactionsGrouped?: ReactionsGrouped[] }>
  >['addCase']
) => {
  addCase(Reaction.ADD.SUCCESS, (state, action: AnyAction) => {
    const { targetType, targetId } = parseContentTarget(
      action.meta.contentTarget
    );
    if (targetType !== forTargetType) {
      return;
    }

    const entity = state.entities[targetId];
    if (!entity) {
      return;
    }

    const reactionEmoji = action.meta.emoji;
    const reactionId = action.payload.id;

    entity.reactionsGrouped ??= [];

    let found = false;
    for (const reaction of entity.reactionsGrouped) {
      if (reaction.emoji === reactionEmoji) {
        found = true;
        reaction.count++;
        reaction.hasReacted = true;
        reaction.reactionId = reactionId;
      }
    }

    if (!found) {
      const unicodeString = action.meta.unicodeString;

      entity.reactionsGrouped.push({
        emoji: reactionEmoji,
        unicodeString,
        count: 1,
        hasReacted: true,
        reactionId,
      });
    }
  });
  addCase(Reaction.DELETE.SUCCESS, (state, action: AnyAction) => {
    const { targetType, targetId } = parseContentTarget(
      action.meta.contentTarget
    );
    if (targetType !== forTargetType) {
      return;
    }

    const entity = state.entities[targetId];
    if (!entity) {
      return;
    }

    entity.reactionsGrouped ??= [];
    for (const reaction of entity.reactionsGrouped) {
      if (reaction.reactionId === action.meta.id) {
        reaction.count--;
        reaction.hasReacted = false;
        delete reaction.reactionId;
      }
    }
    entity.reactionsGrouped = entity.reactionsGrouped.filter(
      (reaction) => reaction.count !== 0
    );
  });
};
