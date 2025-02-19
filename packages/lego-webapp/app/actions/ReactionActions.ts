import callAPI from 'app/actions/callAPI';
import { Reaction } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { AppDispatch } from 'app/store/createStore';
import type { RejectedPromiseAction } from 'app/store/middleware/promiseMiddleware';
import type { ReactionResponse } from 'app/store/models/Reaction';
import type { CurrentUser } from 'app/store/models/User';
import type { HttpError } from 'app/utils/fetchJSON';

export function addReaction({
  emoji,
  user,
  contentTarget,
  unicodeString,
}: {
  emoji: string;
  user?: CurrentUser;
  contentTarget: string;
  unicodeString: string;
}) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<ReactionResponse>({
        types: Reaction.ADD,
        endpoint: '/reactions/',
        method: 'POST',
        body: {
          emoji,
          content_target: contentTarget,
        },
        meta: {
          emoji,
          user: user,
          contentTarget,
          unicodeString,
        },
      }),
    ).catch(
      (action: RejectedPromiseAction<HttpError, Record<string, unknown>>) => {
        const status = action.payload.response?.status;
        let errorMessage = 'Reaksjon feilet';

        if (status === 409) {
          errorMessage = 'Du har allerede reagert med denne emojien';
        } else if (status === 413) {
          errorMessage = 'Du har reagert for mange ganger';
        }

        action.meta.errorMessage = errorMessage;
        dispatch(action);
      },
    );
  };
}
export function deleteReaction({
  reactionId,
  contentTarget,
}: {
  reactionId: EntityId;
  contentTarget: string;
}) {
  return callAPI<void>({
    types: Reaction.DELETE,
    endpoint: `/reactions/${reactionId}/`,
    method: 'DELETE',
    meta: {
      id: reactionId,
      contentTarget,
      errorMessage: 'Sletting av reaksjon feilet',
    },
  });
}
