import { createSelector } from 'reselect';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import createEntityReducer from 'app/utils/createEntityReducer';
import { CompanyInterestForm } from '../actions/ActionTypes';

export enum CompanyInterestCompanyType {
  SmallConsultant = 'company_types_small_consultant',
  MediumConsultant = 'company_types_medium_consultant',
  LargeConsultant = 'company_types_large_consultant',
  Inhouse = 'company_types_inhouse',
  Others = 'company_types_others',
  StartUp = 'company_types_start_up',
  Governmental = 'company_types_governmental',
}

export type CompanyInterestEntity = {
  id: number;
  companyName: string;
  mail: string;
  contactPerson: string;
  companyPresentation: boolean;
  course: boolean;
  breakfastTalk: boolean;
  lunchPresentation: boolean;
  readme: boolean;
  collaboration: boolean;
  comment: boolean;
  semesters: Array<CompanySemesterEntity>;
  companyType: CompanyInterestCompanyType;
  officeInTrondheim: boolean;
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
  (state, props, selectedEventOption) => selectedEventOption,
  (companyInterestById, companyInterestIds, semesterId, eventValue) => {
    const companyInterests = companyInterestIds.map(
      (id) => companyInterestById[id]
    );
    if (semesterId === 0 && eventValue === '') {
      return companyInterests;
    }
    if (semesterId === 0 && eventValue !== '') {
      return companyInterests.filter((companyInterest) =>
        companyInterest.events.includes(eventValue)
      );
    }
    if (semesterId !== 0 && eventValue === '') {
      return companyInterests.filter((companyInterest) =>
        companyInterest.semesters.includes(semesterId)
      );
    }

    return companyInterests.filter(
      (companyInterest) =>
        companyInterest.semesters.includes(semesterId) &&
        companyInterest.events.includes(eventValue)
    );
  }
);
export const selectCompanyInterestById = createSelector(
  (state) => state.companyInterest.byId,
  (state, props) => props.companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
