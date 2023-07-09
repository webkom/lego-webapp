import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { RootState } from 'app/store/createRootReducer';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { CompanyInterestForm } from '../actions/ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';

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

const legoAdapter = createLegoAdapter(EntityType.CompanyInterests, {
  fetchActions: [CompanyInterestForm.FETCH_ALL],
  deleteActions: [CompanyInterestForm.DELETE],
});
const companyInterestsSlice = createSlice({
  name: EntityType.CompanyInterests,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers(),
});

export default companyInterestsSlice.reducer;
export const {
  selectAll: selectAllCompanyInterests,
  selectById: selectCompanyInterestById,
  selectEntities: selectCompanyInterestEntities,
  selectIds: selectCompanyInterestIds,
} = legoAdapter.getSelectors((state: RootState) => state.companyInterest);

export const selectCompanyInterestList = createSelector(
  selectCompanyInterestEntities,
  selectCompanyInterestIds,
  (_: RootState, semesterId: EntityId) => semesterId,
  (_: RootState, __: EntityId, eventValue: string) => eventValue,
  (companyInterestEntities, companyInterestIds, semesterId, eventValue) => {
    const companyInterests = companyInterestIds.map(
      (id) => companyInterestEntities[id]
    );
    if (semesterId === 0 && eventValue === '') {
      return companyInterests;
    }
    if (semesterId === 0 && eventValue !== '') {
      return companyInterests.filter(
        (companyInterest) =>
          companyInterest &&
          'events' in companyInterest &&
          companyInterest.events.includes(eventValue)
      );
    }
    if (semesterId !== 0 && eventValue === '') {
      return companyInterests.filter((companyInterest) =>
        companyInterest?.semesters.includes(semesterId)
      );
    }

    return companyInterests.filter(
      (companyInterest) =>
        companyInterest &&
        'events' in companyInterest &&
        companyInterest.semesters.includes(semesterId) &&
        companyInterest.events.includes(eventValue)
    );
  }
);
