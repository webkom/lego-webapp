import callAPI from 'app/actions/callAPI';
import { restrictedMailSchema } from 'app/reducers';
import { RestrictedMail } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { RestrictedMailEntity } from 'app/reducers/restrictedMails';

export function fetchRestrictedMail(restrictedMailId: EntityId) {
  return callAPI({
    types: RestrictedMail.FETCH,
    endpoint: `/restricted-mail/${restrictedMailId}/`,
    schema: restrictedMailSchema,
    meta: {
      errorMessage: 'Henting av begrenset e-post feilet',
    },
    propagateError: true,
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
      errorMessage: 'Opprettelse av begrenset e-post feilet',
    },
  });
}

export function fetch({ next = false }: { next?: boolean }) {
  return callAPI({
    types: RestrictedMail.FETCH,
    endpoint: '/restricted-mail/',
    pagination: {
      fetchNext: next,
    },
    schema: [restrictedMailSchema],
    meta: {
      errorMessage: 'Henting av begrensete e-poster feilet',
    },
    propagateError: true,
  });
}
