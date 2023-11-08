import callAPI from 'app/actions/callAPI';
import type { ID } from 'app/models';
import type { Thunk } from 'app/types';
import { Reaction } from './ActionTypes';

export function addReaction({
  emoji,
  userId,
  contentTarget,
  unicodeString,
}: {
  emoji: string;
  userId?: ID;
  contentTarget: string;
  unicodeString: string;
}): Thunk<void> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Reaction.ADD,
        endpoint: '/reactions/',
        method: 'POST',
        body: {
          emoji,
          content_target: contentTarget,
        },
        meta: {
          emoji,
          userId: userId,
          contentTarget,
          unicodeString,
        },
      })
    ).catch((action) => {
      const status = action.payload.response.status;
      let errorMessage = 'Reaksjon feilet';

      if (status === 409) {
        errorMessage = 'Du har allerede reagert med denne emojien';
      } else if (status === 413) {
        errorMessage = 'Du har reagert for mange ganger';
      }

      dispatch({
        type: Reaction.ADD.FAILURE,
        error: true,
        meta: {
          errorMessage,
        },
      });
    });
  };
}
export function deleteReaction({
  reactionId,
  userId,
  contentTarget,
}: {
  reactionId: ID;
  userId: ID;
  contentTarget: string;
}): Thunk<any> {
  return callAPI({
    types: Reaction.DELETE,
    endpoint: `/reactions/${reactionId}/`,
    method: 'DELETE',
    meta: {
      id: reactionId,
      userId: userId,
      contentTarget,
      errorMessage: 'Sletting av reaksjon feilet',
    },
  });
}
