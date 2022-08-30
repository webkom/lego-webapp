// @flow

import { union, find } from 'lodash';
import { createSelector } from 'reselect';
import { User, Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import { produce } from 'immer';
import type { PhotoConsent } from '../models';

export type UserEntity = {
  id: number,
  username: string,
  fullName: string,
  firstName: string,
  lastName: string,
  gender: string,
  profilePicture: string,
  emailListsEnabled?: boolean,
  selectedTheme: string,
  photoConsents?: Array<PhotoConsent>,
};

type State = any;

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH,
  },
  mutate: produce((newState: State, action: any): void => {
    switch (action.type) {
      case Event.SOCKET_EVENT_UPDATED: {
        const users =
          normalize(action.payload, eventSchema).entities.users || {};
        newState.byId = mergeObjects(newState.byId, users);
        newState.items = union(
          newState.items,
          (Object.values(users): any).map((u) => u.id)
        );
        break;
      }

      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.ADMIN_REGISTER.SUCCESS: {
        if (!action.payload.user) break;
        const users = normalize(action.payload, registrationSchema).entities
          .users;
        newState.byId = mergeObjects(newState.byId, users);
        newState.items = union(
          newState.items,
          (Object.values(users): any).map((u) => u.id)
        );
        break;
      }

      case User.CONFIRM_STUDENT_USER.SUCCESS: {
        newState.byId = mergeObjects(newState.byId, action.payload);
        break;
      }

      default:
        break;
    }
  }),
});

export const selectUserById = createSelector(
  (state) => state.users.byId,
  (state, props) => props.userId,
  (usersById, userId) => usersById[userId] || {}
);

export const selectUserByUsername = createSelector(
  (state) => state.users.byId,
  (state, props) => props.username,
  (usersById, username) => find(usersById, ['username', username])
);

export const selectUserWithGroups = createSelector(
  (state, { username, userId }: { username?: string, userId?: string }) =>
    username
      ? selectUserByUsername(state, { username })
      : selectUserById(state, { userId }),
  (state) => state.groups.byId,
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
