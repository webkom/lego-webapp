// @flow

import { union, find } from 'lodash';
import { createSelector } from 'reselect';
import { User, Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';

export type UserEntity = {
  id: number,
  username: string,
  fullName: string,
  firstName: string,
  lastName: string,
  gender: string,
  profilePicture: string
};

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_EVENT_UPDATED: {
        const users =
          normalize(action.payload, eventSchema).entities.users || {};
        return {
          ...state,
          byId: mergeObjects(state.byId, users),
          items: union(state.items, Object.keys(users))
        };
      }
      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.ADMIN_REGISTER.SUCCESS: {
        const users = normalize(action.payload, registrationSchema).entities
          .users;
        return {
          ...state,
          byId: mergeObjects(state.byId, users),
          items: union(state.items, [action.payload.id])
        };
      }
      case User.CONFIRM_STUDENT_USER.SUCCESS: {
        return {
          ...state,
          byId: mergeObjects(state.byId, action.payload)
        };
      }
      default:
        return state;
    }
  }
});

export const selectUserById = createSelector(
  state => state.users.byId,
  (state, props) => props.userId,
  (usersById, userId) => usersById[userId] || {}
);

export const selectUserByUsername = createSelector(
  state => state.users.byId,
  (state, props) => props.username,
  (usersById, username) => find(usersById, ['username', username]) || {}
);

export const selectUserWithGroups = createSelector(
  selectUserByUsername,
  state => state.groups.byId,
  (user, groupsById) => ({
    ...user,
    abakusGroups: (user.abakusGroups || []).map(groupId => groupsById[groupId])
  })
);
