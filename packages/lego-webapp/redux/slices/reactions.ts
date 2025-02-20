import { Reaction } from '~/redux/actionTypes';
import { parseContentTarget } from '~/utils/contentTarget';
import type {
  AnyAction,
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { EntityType } from '~/redux/models/entities';

export const addReactionCases = (
  forTargetType: EntityType,
  addCase: ActionReducerMapBuilder<
    EntityState<{ reactionsGrouped?: ReactionsGrouped[] }, EntityId>
  >['addCase'],
) => {
  addCase(Reaction.ADD.SUCCESS, (state, action: AnyAction) => {
    const { targetType, targetId } = parseContentTarget(
      action.meta.contentTarget,
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
      action.meta.contentTarget,
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
      (reaction) => reaction.count !== 0,
    );
  });
};
