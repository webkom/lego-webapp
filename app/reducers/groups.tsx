//@flow
import { createSelector } from 'reselect';
import { Group, Membership } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import without from 'lodash/without';
import union from 'lodash/union';
import { ID } from 'app/models';
import mergeObjects from 'app/utils/mergeObjects';

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

export default createEntityReducer({
  key: 'groups',
  types: {
    fetch: Group.FETCH,
    mutate: Group.MEMBERSHIP_FETCH
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
      case Group.MEMBERSHIP_FETCH.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.groupId]: {
              ...state.byId[action.meta.groupId],
              memberships: union(
                state.byId[action.meta.groupId].memberships,
                action.payload.result
              )
            }
          }
        };
      }
      default:
        return state;
    }
  }
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
