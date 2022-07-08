// @flow

import callAPI from 'app/actions/callAPI';
import { emailUserSchema } from 'app/reducers';
import { type EmailUserEntity } from 'app/reducers/emailUsers';
import type { EntityID, Thunk } from 'app/types';
import { EmailUser } from './ActionTypes';

export function fetchEmailUser(userId: EntityID): Thunk<any> {
  return callAPI({
    types: EmailUser.FETCH,
    endpoint: `/email-users/${userId}/`,
    schema: emailUserSchema,
    meta: {
      errorMessage: 'Henting av epostliste feilet',
    },
    propagateError: true,
  });
}

export function createEmailUser(emailUser: EmailUserEntity): Thunk<*> {
  return callAPI({
    types: EmailUser.CREATE,
    endpoint: '/email-users/',
    method: 'POST',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Opprettelse av epostliste feilet',
    },
  });
}

export function editEmailUser(emailUser: EmailUserEntity): Thunk<*> {
  return callAPI({
    types: EmailUser.EDIT,
    endpoint: `/email-users/${emailUser.id}/`,
    method: 'PUT',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Endring av epostliste feilet',
    },
  });
}

export function fetch({
  next,
  query,
}: { next?: boolean, query: Object } = {}): Thunk<*> {
  return (dispatch, getState) => {
    return dispatch(
      callAPI({
        types: EmailUser.FETCH,
        endpoint: '/email-users/',
        useCache: false,
        query,
        pagination: { fetchNext: !!next },
        schema: [emailUserSchema],
        meta: {
          errorMessage: 'Henting av epostlister feilet',
        },
        propagateError: true,
      })
    );
  };
}
