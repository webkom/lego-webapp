import { type AnyAction, createSlice } from '@reduxjs/toolkit';
import { union } from 'lodash';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { adminRegister } from 'app/actions/EventActions';
import { confirmStudentUser, fetchUser } from 'app/actions/UserActions';
import {
  socketEventUpdated,
  socketRegistrationSuccess,
} from 'app/actions/WebsocketActions';
import type { ID } from 'app/store/models';
import { EntityType } from 'app/store/models/Entities';
import type UserType from 'app/store/models/User';
import type { RootState } from 'app/store/rootReducer';
import { eventSchema, registrationSchema } from 'app/store/schemas';
import type { EntityReducerState } from 'app/store/utils/entityReducer';
import addEntityReducer, {
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';
import mergeObjects from 'app/utils/mergeObjects';
import type { PhotoConsent } from '../models';

export interface UserEntity extends UserType {
  emailListsEnabled?: boolean;
  selectedTheme?: string;
  photoConsents?: Array<PhotoConsent>;
}

export type UsersState = EntityReducerState<UserType>;

const initialState: UsersState = getInitialEntityReducerState();

const usersSlice = createSlice({
  name: EntityType.Users,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(confirmStudentUser.success, (state, action) => {
        state.byId = mergeObjects(state.byId, action.payload);
      })
      .addCase(socketEventUpdated, (state, action) => {
        const users =
          normalize(action.payload, eventSchema).entities.users || {};
        state.byId = mergeObjects(state.byId, users);
        state.items = union(
          state.items,
          Object.values(users).map((u) => u.id)
        );
      });

    builder.addMatcher(
      (
        action: AnyAction
      ): action is
        | ReturnType<typeof socketRegistrationSuccess>
        | ReturnType<typeof adminRegister.success> =>
        socketRegistrationSuccess.match(action) ||
        adminRegister.success.match(action),
      (state, action) => {
        if (!action.payload.user) return;
        const users = normalize(action.payload, registrationSchema).entities
          .users;
        state.byId = mergeObjects(state.byId, users);
        state.items = union(
          state.items,
          Object.values(users).map((u) => u.id)
        );
      }
    );

    addEntityReducer(builder, EntityType.Users, {
      fetch: fetchUser,
    });
  },
});

export default usersSlice.reducer;

export const selectUserById = createSelector(
  (state: RootState) => state.users.byId,
  (state: RootState, props: { userId: ID }) => props.userId,
  (usersById, userId) => usersById[userId] || undefined
);

export const selectUserByUsername = createSelector(
  (state: RootState) => state.users.byId,
  (state: RootState, props: { username: string }) => props.username,
  (usersById, username) =>
    Object.values(usersById).find((user) => user.username === username)
);

export const selectUserWithGroups = createSelector(
  (
    state: RootState,
    {
      username,
      userId,
    }: {
      username?: string;
      userId?: string;
    }
  ) =>
    username
      ? selectUserByUsername(state, {
          username,
        })
      : selectUserById(state, {
          userId,
        }),
  (state: RootState) => state.groups.byId,
  (user, groupsById) => {
    if (!user) return;
    return {
      ...user,
      abakusGroups: user.abakusGroups
        ? user.abakusGroups.map((groupId) => groupsById[groupId])
        : [],
    };
  }
);
