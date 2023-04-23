import { produce } from 'immer';
import { Comment } from 'app/actions/ActionTypes';
import type { ID } from 'app/models';
import type { Comment as CommentType } from 'app/store/models/Comment';
import createEntityReducer, {
  type EntityReducerState,
} from 'app/utils/createEntityReducer';
import getEntityType from 'app/utils/getEntityType';
import type { AnyAction } from 'redux';

type WithComments<T> = T & { comments: CommentType[] };

type StateWithComments<T, S> = S & {
  byId: Record<ID, WithComments<T>>;
};

/**
 * Used by the individual entity reducers
 */
export function mutateComments<T, S = EntityReducerState<T>>(
  forTargetType: string
) {
  return produce((newState: StateWithComments<T, S>, action: AnyAction) => {
    switch (action.type) {
      case Comment.ADD.SUCCESS: {
        const [serverTargetType, targetId] =
          action.meta.contentTarget.split('-');
        const targetType = getEntityType(serverTargetType);

        if (targetType === forTargetType) {
          newState.byId[targetId].comments =
            newState.byId[targetId].comments || [];
          newState.byId[targetId].comments.push(action.payload.result);
        }

        break;
      }

      default:
        break;
    }
  });
}

const mutate = produce(
  (newState: EntityReducerState<CommentType>, action: AnyAction): void => {
    switch (action.type) {
      case Comment.DELETE.SUCCESS:
        newState.byId[action.meta.id].text = null;
        newState.byId[action.meta.id].author = null;
        break;

      default:
        break;
    }
  }
);

export default createEntityReducer<CommentType>({
  key: 'comments',
  types: {
    fetch: Comment.FETCH,
  },
  mutate,
});
