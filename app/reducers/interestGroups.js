// @flow

import { createSelector } from 'reselect';
import { InterestGroup } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { omit } from 'lodash';

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
      case InterestGroup.REMOVE.SUCCESS: {
        const removedId = action.meta.groupId;
        return {
          ...state,
          items: state.items.filter(g => g !== removedId),
          byId: omit(state.byId, removedId)
        };
      }
      case InterestGroup.JOIN.SUCCESS: {
        const { user, groupId } = action.meta;
        const membership = { ...action.payload, user };
        const memberships = [membership].concat(
          state.byId[groupId].memberships
        );
        return {
          ...state,
          byId: {
            ...state.byId,
            [groupId]: {
              ...state.byId[groupId],
              memberships
            }
          }
        };
      }
      case InterestGroup.LEAVE.SUCCESS: {
        const { user, groupId } = action.meta;
        return {
          ...state,
          byId: {
            ...state.byId,
            [groupId]: {
              ...state.byId[groupId],
              memberships: state.byId[groupId].memberships.filter(
                m => m.user.id !== user.id
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

export const selectInterestGroups = createSelector(
  state => state.interestGroups.byId,
  state => state.interestGroups.items,
  (interestGroupById, interestGroupIds) =>
    interestGroupIds.map(id => interestGroupById[id])
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
