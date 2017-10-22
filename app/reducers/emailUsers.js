// @flow

import { createSelector } from 'reselect';
import { EmailUser } from '../actions/ActionTypes';
import { type UserEntity } from 'app/reducers/users';
import createEntityReducer from 'app/utils/createEntityReducer';

export type EmailUserEntity = {
  id: number,
  user: UserEntity,
  internalEmailEnabled: boolean,
  internalEmail: string
};

export default createEntityReducer({
  key: 'emailUsers',
  types: {
    fetch: EmailUser.FETCH,
    mutate: EmailUser.CREATE
  }
});

export const selectEmailUsers = createSelector(
  state => state.emailUsers.byId,
  state => state.users.byId,
  state => state.emailUsers.items,
  (emailUsersById, usersById, emailUserIds) =>
    emailUserIds.map(id => ({
      ...emailUsersById[id],
      user: usersById[emailUsersById[id].user]
    }))
);

export const selectEmailUserById = createSelector(
  state => state.emailUsers.byId,
  state => state.users.byId,
  (state, props) => props.emailUserId,
  (emailUsersById, usersById, emailUserId) => {
    const emailUser = emailUsersById[emailUserId];

    if (!emailUser) {
      return { user: {} };
    }

    return {
      ...emailUser,
      user: usersById[emailUser.user]
    };
  }
);
