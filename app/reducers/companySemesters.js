// @flow

import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { sortSemesterChronologically } from 'app/routes/companyInterest/utils';
import produce from 'immer';

export type CompanySemesterEntity = {
  id?: number,
  semester: string,
  year: number | string,
  activeInterestForm?: boolean
};

type State = any;

export default createEntityReducer({
  key: 'companySemesters',
  types: {
    fetch: Company.FETCH_SEMESTERS
  },
  // TODO: I think this can be removed by using { types: mutate: Company.ADD_SEMESTER} above
  mutate(state: State, action): State {
    return produce(
      state,
      (newState: State): void => {
        switch (action.type) {
          case Company.ADD_SEMESTER.SUCCESS:
            newState.byId[action.payload.id] = action.payload;
            newState.items.push(action.payload.id);
        }
      }
    );
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
