// @flow

import { RestrictedMail } from './ActionTypes';
import { restrictedMailSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import type { EntityID, Thunk } from 'app/types';
import type { RestrictedMailEntity } from 'app/reducers/restrictedMails';

export function fetchRestrictedMail(restrictedMailId: EntityID) {
  return callAPI({
    types: RestrictedMail.FETCH,
    endpoint: `/restricted-mail/${restrictedMailId}/`,
    schema: restrictedMailSchema,
    meta: {
      errorMessage: 'Henting av begrenset epost feilet'
    },
    propagateError: true
  });
}

export function createRestrictedMail(restrictedMail: RestrictedMailEntity) {
  return callAPI({
    types: RestrictedMail.CREATE,
    endpoint: '/restricted-mail/',
    method: 'POST',
    schema: restrictedMailSchema,
    body: restrictedMail,
    meta: {
      errorMessage: 'Opprettelse av begrenset epost feilet'
    }
  });
}

export function fetch({ next }: { next: boolean } = {}): Thunk<*> {
  return (dispatch, getState) => {
    return dispatch(
      callAPI({
        types: RestrictedMail.FETCH,
        endpoint: `/restricted-mail/${next
          ? `?${getState().restrictedMails.pagination.next}`
          : ''}`,
        schema: [restrictedMailSchema],
        meta: {
          errorMessage: 'Henting av begrensete eposter feilet'
        },
        propagateError: true
      })
    );
  };
}
