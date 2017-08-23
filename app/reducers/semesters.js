import createEntityReducer from 'app/utils/createEntityReducer';
import { CompanyInterestForm } from '../actions/ActionTypes';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'semesters',
  types: {
    fetch: CompanyInterestForm.FETCH_SEMESTERS
  }
});

export const selectSemesters = createSelector(
  state => state.semesters.byId,
  state => state.semesters.items,
  (semestersById, semesterIds) => semesterIds.map(id => semestersById[id])
);
