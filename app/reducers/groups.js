import { Group } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'groups',
  types: [Group.FETCH.BEGIN, Group.FETCH.SUCCESS, Group.FETCH.FAILURE]
});

export function selectGroup(state, { groupId }) {
  const group = state.groups.byId[groupId];

  if (group && group.users) {
    return {
      ...group,
      users: group.users.map((userId) => state.users.byId[userId])
    };
  }

  return group;
}
