// @flow

import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'companySemesters',
  types: {
    fetch: Company.FETCH_SEMESTERS
  },
  mutate(state, action) {
    return state;
  }
});

export const selectCompanySemesters = createSelector(
  state => state.companySemesters.items,
  state => state.companySemesters.byId,
  (semesterIds, semestersById) => {
    if (!semesterIds || !semestersById) return [];
    return semesterIds.map(id => semestersById[id]);
  }
);
