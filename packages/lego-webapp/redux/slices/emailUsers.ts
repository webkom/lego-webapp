import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { EmailUser as EmailUserActions } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectUserWithGroups } from '~/redux/slices/users';
import type EmailUser from '~/redux/models/EmailUser';
import type { RootState } from '~/redux/rootReducer';
import type { UserEntity } from '~/redux/slices/users';

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
export const {
  selectAllPaginated: selectEmailUsers,
  selectById: selectEmailUserById,
} = legoAdapter.getSelectors<RootState>((state) => state.emailUsers);

export const transformEmailUser = (emailUser: EmailUser, state: RootState) => ({
  ...emailUser,
  user: selectUserWithGroups(state, { userId: emailUser.id }),
});

export const selectTransformedEmailUsers = createSelector(
  selectEmailUsers,
  (state: RootState) => state,
  (emailUsers, state) =>
    emailUsers.map((emailUser) => transformEmailUser(emailUser, state)),
);
