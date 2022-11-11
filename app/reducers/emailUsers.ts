import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  fetch,
  fetchEmailUser,
  createEmailUser,
} from 'app/actions/EmailUserActions';
import { selectUserWithGroups } from 'app/reducers/users';
import type { ID } from 'app/store/models';
import type EmailUser from 'app/store/models/EmailUser';
import { EntityType } from 'app/store/models/Entities';
import type User from 'app/store/models/User';
import type { RootState } from 'app/store/rootReducer';
import type { EntityReducerState } from 'app/store/utils/entityReducer';
import addEntityReducer, {
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type EmailUserEntity = Omit<EmailUser, 'user'> & {
  user: User;
};

type EmailUserState = EntityReducerState<EmailUser>;

const initialState: EmailUserState = getInitialEntityReducerState();

const emailUsersSlice = createSlice({
  name: EntityType.EmailUsers,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(builder, EntityType.EmailUsers, {
      fetch: [fetch, fetchEmailUser],
      mutate: createEmailUser,
    });
  },
});

export default emailUsersSlice.reducer;

export const selectEmailUsers = createSelector(
  (state: RootState) => state.emailUsers.byId,
  (state: RootState) => state.users.byId,
  (state: RootState) => state.emailUsers.items,
  (_: RootState, { pagination }: { pagination: string }) => pagination,
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
  (state: RootState) => state.emailUsers.byId,
  (state: RootState) => state.users.byId,
  (state: RootState, props: { emailUserId: ID }) => props.emailUserId,
  (
    emailUsersById,
    usersById,
    emailUserId
  ): EmailUserEntity | Record<string, never> => {
    const emailUser = emailUsersById[emailUserId];

    if (!emailUser) {
      return {};
    }

    return { ...emailUser, user: usersById[emailUser.user] };
  }
);
