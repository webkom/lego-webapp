// @flow

import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Membership, Group } from '../actions/ActionTypes';
import { selectGroup } from './groups';

export default createEntityReducer({
  key: 'memberships',
  types: {
    mutate: Membership.JOIN_GROUP,
    fetch: Group.MEMBERSHIP_FETCH,
    delete: Membership.LEAVE_GROUP,
  },
});

export const selectMembershipsForGroup = createSelector(
  (_, { descendants = false }) => descendants,
  (_, { groupId }) => groupId,
  selectGroup,
  (state) => state.memberships.byId,
  (state) => state.users.byId,
  (state) => state.users.byId,
  (descendants, groupId, group, membershipsById, users) => {
    if (!group) return [];
    const memberships = group.memberships;
    if (!memberships) return [];
    return memberships
      .map((m) => membershipsById[m])
      .filter((m) =>
        descendants ? true : Number(m.abakusGroup) === Number(groupId)
      )
      .map((m) => {
        const userId = m.user;
        const user = users[userId];
        return {
          ...m,
          user,
        };
      });
  }
);
