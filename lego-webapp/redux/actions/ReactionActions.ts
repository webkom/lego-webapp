import { Reaction } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import type { EntityId } from '@reduxjs/toolkit';
import type { AppDispatch } from '~/redux/createStore';
import type { RejectedPromiseAction } from '~/redux/middlewares/promiseMiddleware';
import type { ReactionResponse } from '~/redux/models/Reaction';
import type { CurrentUser } from '~/redux/models/User';
import type { HttpError } from '~/utils/fetchJSON';

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
