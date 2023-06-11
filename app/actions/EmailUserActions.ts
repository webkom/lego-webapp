import callAPI from 'app/actions/callAPI';
import { emailUserSchema } from 'app/reducers';
import type { EmailUserEntity } from 'app/reducers/emailUsers';
import type { EntityID, Thunk } from 'app/types';
import { EmailUser } from './ActionTypes';

export function fetchEmailUser(userId: EntityID): Thunk<any> {
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
export function createEmailUser(emailUser: EmailUserEntity): Thunk<any> {
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
export function editEmailUser(emailUser: EmailUserEntity): Thunk<any> {
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
      })
    );
  };
}
