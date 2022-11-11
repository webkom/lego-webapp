import { createSlice } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import type { ID } from 'app/store/models';
import { EntityType } from 'app/store/models/Entities';
import type Reaction from 'app/store/models/Reaction';
import { splitContentTarget } from 'app/store/utils/contentTarget';
import {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';
import getEntityType from 'app/utils/getEntityType';

export type ReactionsState = EntityReducerState<Reaction>;

const initialState: ReactionsState = getInitialEntityReducerState();

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {},
});

export default reactionsSlice.reducer;

export interface ReactionsGrouped {
  reactionId: ID | null;
  emoji: string;
  unicodeString: string;
  count: number;
  hasReacted: boolean;
}

interface EntityWithReactions {
  reactionsGrouped: ReactionsGrouped[];
}

export const addMutateReactionsReducer = (
  builder: ActionReducerMapBuilder<EntityReducerState<EntityWithReactions>>,
  forTargetType: EntityType
) => {
  builder.addMatcher(addReaction.success.match, (state, action) => {
    const { targetType, targetId } = splitContentTarget(
      action.meta.contentTarget
    );
    const reactionEmoji = action.meta.emoji;
    const unicodeString = action.meta.unicodeString;
    const reactionId = action.payload.result;

    if (targetType !== forTargetType) {
      return state;
    }

    let found = false;
    state.byId[targetId].reactionsGrouped = state.byId[
      targetId
    ].reactionsGrouped
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
      );
  });
  builder.addMatcher(deleteReaction.success.match, (state, action) => {
    const { targetType, targetId } = splitContentTarget(
      action.meta.contentTarget
    );
    const reactionId = action.meta.id;

    if (targetType !== forTargetType) {
      return state;
    }

    state.byId[targetId] = {
      ...state.byId[reactionId],
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
    };
  });
};

export function mutateReactions(forTargetType: string) {
  return (state: any, action: any) => {
    switch (action.type) {
      case addReaction.success: {
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

      case deleteReaction.success: {
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
