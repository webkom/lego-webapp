import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { sortSemesterChronologically } from 'app/routes/companyInterest/utils';

export default createEntityReducer({
  key: 'companySemesters',
  types: {
    fetch: Company.FETCH_SEMESTERS
  },
  mutate(state, action) {
    switch (action.type) {
      case Company.ADD_SEMESTER.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: action.payload
          },
          items: state.items.concat(action.payload.id)
        };
      }
      default:
        return state;
    }
  }
});

export const selectCompanySemesters = createSelector(
  state => state.companySemesters.items,
  state => state.companySemesters.byId,
  (semesterIds, semestersById) => {
    return !semesterIds || !semestersById
      ? []
      : semesterIds.map(id => semestersById[id]);
  }
);

export const selectCompanySemestersForInterestForm = createSelector(
  selectCompanySemesters,
  companySemesters =>
    companySemesters
      .filter(semester => semester.activeInterestForm)
      .sort(sortSemesterChronologically)
);
