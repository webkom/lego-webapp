// @flow

import { Comment } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { type UserEntity } from 'app/reducers/users';
import getEntityType from 'app/utils/getEntityType';
import type { ID } from 'app/models';
import produce from 'immer';

export type CommentEntity = {
  id: ID,
  parent?: ID,
  createdAt: string,
  children: Array<Object>,
  text: string | null,
  author: UserEntity | null
};

type State = any;
/**
 * Used by the individual entity reducers
 */
export function mutateComments(forTargetType: string) {
  return (state: any, action: any) => {
    return produce(state, newState => {
      switch (action.type) {
        case Comment.ADD.SUCCESS: {
          const [serverTargetType, targetId] = action.meta.contentTarget.split(
            '-'
          );
          const targetType = getEntityType(serverTargetType);
          if (targetType === forTargetType) {
            newState.byId[targetId].comments =
              newState.byId[targetId].comments || [];
            newState.byId[targetId].comments.push(action.payload.result);
          }
        }
      }
    }
  );

type CommentState = any;

const mutate = produce(
  (newState: CommentState, action: any): void => {
    switch (action.type) {
      case Comment.DELETE.SUCCESS:
        newState.byId[action.meta.id].text = null;
        newState.byId[action.meta.id].author = null;
    }
  }
);

export default createEntityReducer({
  key: 'comments',
  types: {
    fetch: Comment.FETCH
  },
  mutate
});
