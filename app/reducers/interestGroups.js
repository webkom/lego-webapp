// @flow

import { createSelector } from 'reselect';
import { InterestGroup, Membership } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { without } from 'lodash';

export type InterestGroupEntity = {
  id: number,
  name: string,
  description: string
};

export default createEntityReducer({
  key: 'interestGroups',
  types: {
    fetch: InterestGroup.FETCH_ALL,
    mutate: InterestGroup.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case Membership.JOIN_GROUP.SUCCESS: {
        const list = state.byId[action.meta.groupId].memberships.concat(action.payload.result);
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.groupId]: {
              ...state.byId[action.meta.groupId],
              memberships: list
            }
          }
        };
      }
      case Membership.LEAVE_GROUP.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.groupId]: {
              ...state.byId[action.meta.groupId],
              memberships: without(state.byId[action.meta.groupId].memberships, action.meta.id)
            }
          }
        };
      }
      case InterestGroup.REMOVE.SUCCESS: {
        const removedId = action.meta.groupId;
        return {
          ...state,
          items: state.items.filter(g => g !== removedId)
        };
      }
      case Membership.MEMBER_SET.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.id]: {
              ...state.byId[action.meta.id],
              memberships: action.payload.result
            }
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectInterestGroups = createSelector(
  state => state.interestGroups.byId,
  state => state.interestGroups.items,
  (interestGroupById, interestGroupIds) => interestGroupIds.map(id => interestGroupById[id])
);

export const selectInterestGroupById = createSelector(
  state => state.interestGroups.byId,
  (state, props) => props.interestGroupId,
  (interestGroupById, interestGroupId) => {
    const interestGroup = interestGroupById[interestGroupId];
    if (interestGroup) {
      return interestGroup;
    }
    return {};
  }
);
