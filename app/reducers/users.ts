import { produce } from 'immer';
import { union, find } from 'lodash';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { eventSchema, registrationSchema } from 'app/reducers';
import createEntityReducer from 'app/utils/createEntityReducer';
import mergeObjects from 'app/utils/mergeObjects';
import { User, Event } from '../actions/ActionTypes';
import type { PhotoConsent } from '../models';
import type { ID } from 'app/store/models';

export type UserEntity = {
  id: number;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: string;
  profilePicture: string;
  profilePicturePlaceholder?: string;
  emailListsEnabled?: boolean;
  selectedTheme?: string;
  photoConsents?: Array<PhotoConsent>;
  isStudent?: boolean;
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
          (Object.values(users) as any).map((u) => u.id),
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
          (Object.values(users) as any).map((u) => u.id),
        );
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
  (usersById, userId) => usersById[userId] || {},
);

export const selectUsersByIds = createSelector(
  (state) => state.users.byId,
  (state, props) => props.userIds, // Note that this is now an array
  (usersById, userIds) => {
    if (!userIds) return [];
    return userIds.map((userId) => usersById[userId] || {});
  },
);

export const selectUserByUsername = createSelector(
  (state) => state.users.byId,
  (state, props) => props.username,
  (usersById, username) => find(usersById, ['username', username]),
);
export const selectUserWithGroups = createSelector(
  (
    state,
    {
      username,
      userId,
    }: {
      username?: string;
      userId?: ID;
    },
  ) =>
    username
      ? selectUserByUsername(state, {
          username,
        })
      : selectUserById(state, {
          userId,
        }),
  (state) => state.groups.byId,
  (user, groupsById) => {
    if (!user) return;
    return {
      ...user,
      abakusGroups: user.abakusGroups
        ? user.abakusGroups.map((groupId) => groupsById[groupId])
        : [],
    };
  },
);
