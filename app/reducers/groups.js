//@flow
import { produce } from 'immer';
import { createSelector } from 'reselect';

import { type ID, GroupTypeCommittee, GroupTypeInterest } from 'app/models';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Group, Membership } from '../actions/ActionTypes';

export const resolveGroupLink = (group: { type: string, id: ID }) => {
  switch (group.type) {
    case GroupTypeInterest:
      return `/interest-groups/${group.id}`;
    case GroupTypeCommittee:
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
    mutate: Group.MEMBERSHIP_FETCH,
  },
  mutate: produce((newState: State, action: any): void => {
    switch (action.type) {
      case Membership.CREATE.SUCCESS:
        if (!newState.byId[action.meta.groupId]) {
          break;
        }
        if (
          typeof newState.byId[action.meta.groupId].numberOfUsers === 'number'
        ) {
          newState.byId[action.meta.groupId].numberOfUsers += 1;
        }
        break;

      case Membership.REMOVE.SUCCESS:
      case Membership.LEAVE_GROUP.SUCCESS:
        if (!newState.byId[action.meta.groupId]) {
          break;
        }
        if (
          typeof newState.byId[action.meta.groupId].numberOfUsers === 'number'
        ) {
          newState.byId[action.meta.groupId].numberOfUsers -= 1;
        }
        break;

      default:
        break;
    }
  }),
});

export const selectGroup = createSelector(
  (state) => state && state.groups && state.groups.byId,
  (state, props) => props.groupId,
  (groupsById, id) => groupsById && groupsById[id]
);

export const selectGroups = createSelector(
  (state) => state.groups.byId,
  (state) => state.groups.items,
  (groupsById, groupIds) => groupIds.map((id) => groupsById[id])
);

export const selectGroupsWithType = createSelector(
  (state, props) => selectGroups(state),
  (state, props) => props.groupType,
  (groups, groupType) => groups.filter((g) => g.type === groupType)
);
