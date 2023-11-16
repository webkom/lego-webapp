import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { CompanyInterestForm } from '../actions/ActionTypes';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type {
  CompanyInterestEventType,
  CompanyInterestCompanyType,
} from 'app/store/models/CompanyInterest';

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

const legoAdapter = createLegoAdapter(EntityType.CompanyInterests);

const companyInterestSlice = createSlice({
  name: 'companyInterest',
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [CompanyInterestForm.FETCH_ALL],
    deleteActions: [CompanyInterestForm.DELETE],
  }),
});

export default companyInterestSlice.reducer;
const {
  selectAll: selectAllCompanyInterests,
  selectById: selectCompanyInterestById,
} = legoAdapter.getSelectors((state: RootState) => state.companyInterest);
export { selectCompanyInterestById };

export const selectCompanyInterestList = createSelector(
  selectAllCompanyInterests,
  (_: RootState, semesterId: ID) => semesterId,
  (_: RootState, __: ID, eventType: CompanyInterestEventType | '') => eventType,
  (companyInterests, semesterId, eventValue) => {
    if (eventValue === '') {
      if (semesterId === 0) {
        return companyInterests;
      }
      return companyInterests.filter((companyInterest) =>
        companyInterest.semesters.includes(semesterId)
      );
    } else {
      if (semesterId === 0) {
        return companyInterests.filter((companyInterest) =>
          companyInterest.events.includes(eventValue)
        );
      }
      return companyInterests.filter(
        (companyInterest) =>
          companyInterest.semesters.includes(semesterId) &&
          companyInterest.events.includes(eventValue)
      );
    }
  }
);
