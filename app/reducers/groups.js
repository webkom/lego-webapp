import { createSelector } from 'reselect';
import { Group } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'groups',
  types: {
    fetch: Group.FETCH
  }
});

export const selectGroup = createSelector(
  (state) => state.groups.byId,
  (state) => state.users.byId,
  (state, props) => props.groupId,
  (groupsById, usersById, groupId) => {
    const group = groupsById[groupId];
    if (group && group.users) {
      return {
        ...group,
        users: group.users.map((userId) => usersById[userId])
      };
    }
    return group;
  }
);

export const selectGroups = createSelector(
  (state) => state.groups.byId,
  (state) => state.groups.items,
  (groupsById, groupIds) => groupIds.map((id) => groupsById[id])
);
