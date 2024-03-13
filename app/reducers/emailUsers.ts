import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { selectUserWithGroups } from 'app/reducers/users';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { EmailUser as EmailUserActions } from '../actions/ActionTypes';
import type { UserEntity } from 'app/reducers/users';
import type { RootState } from 'app/store/createRootReducer';
import type EmailUser from 'app/store/models/EmailUser';

export type EmailUserEntity = {
  id: number;
  user: UserEntity;
  internalEmailEnabled: boolean;
  internalEmail: string;
};

const legoAdapter = createLegoAdapter(EntityType.EmailUsers);

const emailUserSlice = createSlice({
  name: EntityType.EmailUsers,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [EmailUserActions.FETCH],
  }),
});

export default emailUserSlice.reducer;
const { selectAllPaginated, selectById } = legoAdapter.getSelectors<RootState>(
  (state) => state.emailUsers,
);

const transformEmailUser = (emailUser: EmailUser, state: RootState) => ({
  ...emailUser,
  user: selectUserWithGroups(state, { userId: emailUser.id }),
});

export const selectEmailUsers = createSelector(
  selectAllPaginated,
  (state: RootState) => state,
  (emailUsers, state) =>
    emailUsers.map((emailUser) => transformEmailUser(emailUser, state)),
);

export const selectEmailUserById = createSelector(
  selectById,
  (state: RootState) => state,
  (emailUser, state) => emailUser && transformEmailUser(emailUser, state),
);
