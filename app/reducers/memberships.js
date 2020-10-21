// @flow

import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Membership, Group } from '../actions/ActionTypes';
import { selectGroup } from './groups';

export default createEntityReducer({
  key: 'memberships',
  types: {
    mutate: [Membership.JOIN_GROUP, Membership.CREATE],
    fetch: Group.MEMBERSHIP_FETCH,
    delete: [Membership.LEAVE_GROUP, Membership.REMOVE],
  },
});

export const selectMembershipsForGroup = createSelector(
  // decendants only work if you use paginationNext btw.
  (_, { descendants = false }) => descendants,
  (_, { groupId }) => groupId,
  (_, { pagination = undefined }) => pagination,
  selectGroup,
  (state) => state.memberships.byId,
  (state) => state.memberships.items,
  (state) => state.groups.byId,
  (state) => state.users.byId,
  (
    descendants,
    groupId,
    pagination,
    group,
    membershipsById,
    membershipsItems,
    groupsById,
    users
  ) => {
    if (!group) return [];
    const memberships =
      pagination !== undefined
        ? (pagination && pagination.items) || []
        : membershipsItems;
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
