// @flow

import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export type CompanySemesterEntity = {
  semester: string,
  year: number,
  id?: number
};

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
    if (!semesterIds || !semestersById) return [];
    return semesterIds.map(id => semestersById[id]);
  }
);

export const selectCompanySemestersForInterestform = createSelector(
  selectCompanySemesters,
  companySemesters =>
    companySemesters
      .filter(semester => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        if (currentYear > semester.year) return false;
        if (currentYear === semester.year) {
          if (semester.semester === 'spring') {
            return false;
          }
          if (semester.semester === 'autumn' && currentMonth > 5) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 4)
);
