// @flow

import { createSelector } from 'reselect';
import { CompanyInterestForm } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

export type CompanyInterestEntity = {
  id: number,
  companyName: string,
  mail: string,
  contactPerson: string,
  companyPresentation: boolean,
  course: boolean,
  lunchPresentation: boolean,
  readme: boolean,
  collaboration: boolean,
  itdagene: boolean,
  comment: boolean,
  semesters: Array<CompanySemesterEntity>
};

export default createEntityReducer({
  key: 'companyInterest',
  types: {
    fetch: CompanyInterestForm.FETCH_ALL,
    mutate: CompanyInterestForm.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case CompanyInterestForm.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.companyInterestId !== id)
        };
      default:
        return state;
    }
  }
});

export const selectCompanyInterestList = createSelector(
  state => state.companyInterest.byId,
  state => state.companyInterest.items,
  (state, props) => props,
  (companyInterestById, companyInterestIds, semesterIds) => {
    const companyInterests = companyInterestIds.map(
      id => companyInterestById[id]
    );
    if (semesterIds.length === 0) {
      return companyInterests;
    }
    return companyInterests.filter(companyInterest =>
      semesterIds.some(id => companyInterest.semesters.includes(Number(id)))
    );
  }
);

export const selectCompanyInterestById = createSelector(
  state => state.companyInterest.byId,
  (state, props) => props.companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
