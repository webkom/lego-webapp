import { createSelector } from 'reselect';
import { selectUserWithGroups } from 'app/reducers/users';
import createEntityReducer from 'app/utils/createEntityReducer';
import { EmailUser } from '../actions/ActionTypes';
import type { UserEntity } from 'app/reducers/users';

export type EmailUserEntity = {
  id: number;
  user: UserEntity;
  internalEmailEnabled: boolean;
  internalEmail: string;
};
export default createEntityReducer({
  key: 'emailUsers',
  types: {
    fetch: EmailUser.FETCH,
    mutate: EmailUser.CREATE,
  },
});
export const selectEmailUsers = createSelector(
  (state) => state.emailUsers.byId,
  (state) => state.users.byId,
  (state) => state.emailUsers.items,
  (_, { pagination }) => pagination,
  (state) => state,
  (
    emailUsersById,
    usersById,
    emailUserIds,
    pagination,
    state //$FlowFixMe
  ) =>
    (pagination ? pagination.items || [] : emailUserIds)
      .map((id) => emailUsersById[id])
      .filter(Boolean)
      .map((emailUser) => ({
        ...emailUser,
        //$FlowFixMe
        user: selectUserWithGroups(state, {
          userId: emailUser.id,
        }),
      }))
);
export const selectEmailUserById = createSelector(
  (state) => state.emailUsers.byId,
  (state) => state.users.byId,
  (state, props) => props.emailUserId,
  (emailUsersById, usersById, emailUserId) => {
    const emailUser = emailUsersById[emailUserId];

    if (!emailUser) {
      return {
        user: {},
      };
    }

    return { ...emailUser, user: usersById[emailUser.user] };
  }
);
