// @flow

import { Comment } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { type UserEntity } from 'app/routes/users';
import getEntityType from 'app/utils/getEntityType';

export type CommentEntity = {
  id: string,
  parent?: string,
  createdAt: string,
  text: string,
  author: UserEntity
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

export default createEntityReducer({
  key: 'comments',
  types: {
    fetch: Comment.FETCH
  }
});
