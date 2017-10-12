import { createSelector } from 'reselect';
import { Group, Membership } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import without from 'lodash/without';
import mergeObjects from 'app/utils/mergeObjects';

export default createEntityReducer({
  key: 'groups',
  types: {
    fetch: Group.FETCH
  },
  mutate(state, action) {
    const replaceMemberships = memberships => {
      return mergeObjects(state, {
        byId: {
          [action.meta.groupId]: { memberships }
        }
      });
    };

    switch (action.type) {
      case Membership.CREATE.SUCCESS: {
        const { groupId } = action.meta;
        const group = state.byId[groupId];
        const memberships = group.memberships.concat(action.payload.result);
        return replaceMemberships(memberships);
      }
      case Membership.REMOVE.SUCCESS: {
        const { groupId, id } = action.meta;
        const group = state.byId[groupId];
        const memberships = without(group.memberships, id);
        return replaceMemberships(memberships);
      }
      default:
        return state;
    }
  }
});

export const selectGroup = createSelector(
  state => state.groups.byId,
  state => state.memberships.byId,
  state => state.users.byId,
  (state, props) => props.groupId,
  (groupsById, membershipsById, usersById, groupId) => {
    const group = groupsById[groupId];
    if (group && group.memberships) {
      return {
        ...group,
        memberships: group.memberships.map(id => {
          const membership = membershipsById[id];
          return {
            ...membership,
            user: usersById[membership.user]
          };
        })
      };
    }
    return group;
  }
);

export const selectGroups = createSelector(
  state => state.groups.byId,
  state => state.groups.items,
  (groupsById, groupIds) => groupIds.map(id => groupsById[id])
);
