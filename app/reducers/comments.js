// @flow

import { Comment } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { type UserEntity } from 'app/reducers/users';
import getEntityType from 'app/utils/getEntityType';
import type { ID } from 'app/models';

export type CommentEntity = {
  id: ID,
  parent?: ID,
  createdAt: string,
  children: Array<Object>,
  text: string | null,
  author: UserEntity | null
};

/**
 * Used by the individual entity reducers
 */
export function mutateComments(forTargetType: string) {
  return (state: any, action: any) => {
    switch (action.type) {
      case Comment.ADD.SUCCESS: {
        const [serverTargetType, targetId] = action.meta.commentTarget.split(
          '-'
        );
        const targetType = getEntityType(serverTargetType);
        if (targetType !== forTargetType) {
          return state;
        }

        return {
          ...state,
          byId: {
            ...state.byId,
            [targetId]: {
              ...state.byId[targetId],
              comments: [
                ...state.byId[targetId].comments,
                action.payload.result
              ]
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

function mutate(state: any, action: any) {
  switch (action.type) {
    case Comment.DELETE.SUCCESS: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.meta.id]: {
            ...state.byId[action.meta.id],
            text: null,
            author: null
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default createEntityReducer({
  key: 'comments',
  types: {
    fetch: Comment.FETCH
  },
  mutate
});
