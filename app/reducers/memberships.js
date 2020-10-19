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
    delete: [Membership.LEAVE_GROUP, Membership.REMOVE],
  },
});

export const selectMembershipsForGroup = createSelector(
  (_, { descendants = false }) => descendants,
  (_, { groupId }) => groupId,
  (_, { pagination = undefined }) => pagination,
  selectGroup,
  (state) => state.memberships.byId,
  (state) => state.users.byId,
  (state) => state.users.byId,
  (descendants, groupId, pagination, group, membershipsById, users) => {
    if (!group) return [];
    const memberships =
      pagination !== undefined
        ? (pagination && pagination.items) || []
        : group.memberships;
    if (!memberships) return [];
    return memberships
      .map((m) => membershipsById[m])
      .filter(Boolean)
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
