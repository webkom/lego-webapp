// @flow

import { createSelector } from 'reselect';
import { InterestGroup } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type InterestGroupEntity = {
  id: number;
  name: string;
  description: string;
};

export default createEntityReducer({
  key: 'interestGroups',
  types: {
    fetch: InterestGroup.FETCH_ALL
  },
});

export const selectInterestGroups = createSelector(
  (state) => state.interestGroups.byId,
  (state) => state.interestGroups.items,
  (interestGroupById, interestGroupIds) => interestGroupIds.map((id) => interestGroupById[id])
);

export const selectIntrestGroupById = createSelector(
  (state) => state.interestGroups.byId,
  (state, props) => props.interestGroupId,
  (interestGroupById, interestGroupId) => {
    const interestGroup = interestGroupById[interestGroupId];
    if (interestGroup) {
      return interestGroup;
    }
    return {};
  }
);
