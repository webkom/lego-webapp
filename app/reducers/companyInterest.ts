import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { CompanyInterestEventType } from 'app/store/models/CompanyInterest';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { CompanyInterestForm } from '../actions/ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type CompanySemester from 'app/store/models/CompanySemester';

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
  semesters: CompanySemester[];
  companyType: CompanyInterestCompanyType;
  officeInTrondheim: boolean;
};

const legoAdapter = createLegoAdapter(EntityType.CompanyInterests);

const companyInterestSlice = createSlice({
  name: EntityType.CompanyInterests,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [CompanyInterestForm.FETCH_ALL],
  }),
});

export default companyInterestSlice.reducer;

export const {
  selectAll: selectAllCompanyInterests,
  selectById: selectCompanyInterestById,
} = legoAdapter.getSelectors((state: RootState) => state.companyInterest);

type CompanyInterestFilters = {
  semesterId: EntityId;
  eventType: CompanyInterestEventType;
};
export const selectCompanyInterests = createSelector(
  selectAllCompanyInterests,
  (_: RootState, filters: CompanyInterestFilters) => filters,
  (companyInterests, { semesterId, eventType }) => {
    if (eventType !== CompanyInterestEventType.All) {
      companyInterests = companyInterests.filter((companyInterest) =>
        companyInterest.events.includes(eventType),
      );
    }
    if (semesterId !== 0) {
      companyInterests = companyInterests.filter((companyInterest) =>
        companyInterest.semesters.includes(semesterId),
      );
    }

    return companyInterests;
  },
);
