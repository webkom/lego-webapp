import { EmailUser } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { emailUserSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type { Thunk } from 'app/types';
import type { EmailUserEntity } from '~/redux/slices/emailUsers';

export function fetchEmailUser(userId: EntityId) {
  return callAPI({
    types: EmailUser.FETCH,
    endpoint: `/email-users/${userId}/`,
    schema: emailUserSchema,
    meta: {
      errorMessage: 'Henting av e-postliste feilet',
    },
    propagateError: true,
  });
}

export function createEmailUser(emailUser: EmailUserEntity) {
  return callAPI({
    types: EmailUser.CREATE,
    endpoint: '/email-users/',
    method: 'POST',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Opprettelse av e-postliste feilet',
    },
  });
}

export function editEmailUser(emailUser: EmailUserEntity) {
  return callAPI({
    types: EmailUser.EDIT,
    endpoint: `/email-users/${emailUser.id}/`,
    method: 'PUT',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Endring av e-postliste feilet',
    },
  });
}

export function fetch({
  next,
  query,
}: {
  next?: boolean;
  query?: Record<string, string | number>;
} = {}): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: EmailUser.FETCH,
        endpoint: '/email-users/',
        query,
        pagination: {
          fetchNext: !!next,
        },
        schema: [emailUserSchema],
        meta: {
          errorMessage: 'Henting av e-postlister feilet',
        },
        propagateError: true,
      }),
    );
  };
}
