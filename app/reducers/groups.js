//@flow
import { createSelector } from 'reselect';
import { Group, Membership } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import type { ID } from 'app/models';
import { pull, union } from 'lodash';
import produce from 'immer';

export const resolveGroupLink = (group: { type: string, id: ID }) => {
  switch (group.type) {
    case 'interesse':
      return `/interestgroups/${group.id}`;
    case 'komite':
      return `/pages/komiteer/${group.id}`;
    default:
      return null;
  }
};

type State = any;

export default createEntityReducer({
  key: 'groups',
  types: {
    fetch: Group.FETCH,
    mutate: Group.MEMBERSHIP_FETCH
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Membership.CREATE.SUCCESS:
          newState.byId[action.meta.groupId].memberships.push(
            action.payload.result
          );
          break;

        case Membership.REMOVE.SUCCESS:
          pull(newState.byId[action.meta.groupId].memberships, action.meta.id);
          break;

        case Group.MEMBERSHIP_FETCH.SUCCESS:
          newState.byId[action.meta.groupId].memberships = union(
            newState.byId[action.meta.groupId].memberships,
            action.payload.result
          );
          break;
      }
    }
  )
});

export const selectGroup = createSelector(
  state => state && state.groups && state.groups.byId,
  (state, props) => props.groupId,
  (groupsById, id) => groupsById && groupsById[id]
);

export const selectGroups = createSelector(
  state => state.groups.byId,
  state => state.groups.items,
  (groupsById, groupIds) => groupIds.map(id => groupsById[id])
);

export const selectGroupsWithType = createSelector(
  (state, props) => selectGroups(state),
  (state, props) => props.groupType,
  (groups, groupType) => groups.filter(g => g.type === groupType)
);
