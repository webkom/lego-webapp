// @flow

import { createSelector } from 'reselect';

import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import createEntityReducer from 'app/utils/createEntityReducer';
import { CompanyInterestForm } from '../actions/ActionTypes';

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
  comment: boolean,
  semesters: Array<CompanySemesterEntity>,
};

export default createEntityReducer({
  key: 'companyInterest',
  types: {
    fetch: CompanyInterestForm.FETCH_ALL,
    mutate: CompanyInterestForm.CREATE,
    delete: CompanyInterestForm.DELETE,
  },
});

export const selectCompanyInterestList = createSelector(
  (state) => state.companyInterest.byId,
  (state) => state.companyInterest.items,
  (state, props) => props,
  (companyInterestById, companyInterestIds, semesterId) => {
    const companyInterests = companyInterestIds.map(
      (id) => companyInterestById[id]
    );
    if (semesterId === 0) {
      return companyInterests;
    }
    return companyInterests.filter((companyInterest) =>
      companyInterest.semesters.includes(semesterId)
    );
  }
);

export const selectCompanyInterestById = createSelector(
  (state) => state.companyInterest.byId,
  (state, props) => props.companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
