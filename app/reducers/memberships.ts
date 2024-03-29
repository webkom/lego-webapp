import { createSelector } from 'reselect';
import { selectUserEntities } from 'app/reducers/users';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Membership, Group } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'memberships',
  types: {
    mutate: [Membership.JOIN_GROUP, Membership.CREATE],
    fetch: Group.MEMBERSHIP_FETCH,
    delete: [Membership.LEAVE_GROUP, Membership.REMOVE],
  },
});
export const selectMembershipsForGroup = createSelector(
  (_, { descendants = false }) => descendants,
  (_, { groupId }) => groupId,
  (_, { pagination = undefined }) => pagination,
  (state) => state.memberships.byId,
  (state) => state.memberships.items,
  selectUserEntities,
  (
    descendants,
    groupId,
    pagination,
    membershipsById,
    membershipsItems,
    userEntities,
  ) => {
    if (!pagination && descendants) {
      throw new Error('using descendants without pagination is not supported');
    }

    const memberships =
      pagination !== undefined
        ? (pagination && pagination.items) || []
        : membershipsItems;
    if (!memberships) return [];
    return memberships
      .map((m) => membershipsById[m])
      .filter(Boolean)
      .filter((m) =>
        descendants ? true : Number(m.abakusGroup) === Number(groupId),
      )
      .map((m) => {
        const userId = m.user;
        const user = userEntities[userId];
        return { ...m, user };
      });
  },
);
