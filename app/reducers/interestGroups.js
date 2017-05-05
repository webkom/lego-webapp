// @flow

import { createSelector } from 'reselect';
import { InterestGroup } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type InterestGroupEntity = {
  id: number,
  name: string,
  description: string
};

export default createEntityReducer({
  key: 'interestGroups',
  types: {
    fetch: InterestGroup.FETCH_ALL
  },
  mutate(state, action) {
    switch (action.type) {
      case InterestGroup.REMOVE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.interestGroupId !== id)
        };

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
