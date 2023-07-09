import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { sortSemesterChronologically } from 'app/routes/companyInterest/utils';
import type { RootState } from 'app/store/createRootReducer';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Company } from '../actions/ActionTypes';

export type CompanySemesterEntity = {
  id?: number;
  semester: string;
  year: number | string;
  activeInterestForm?: boolean;
};

const legoAdapter = createLegoAdapter(EntityType.CompanySemesters, {
  fetchActions: [Company.FETCH_SEMESTERS],
});

const companySemestersSlice = createSlice({
  name: EntityType.CompanySemesters,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers(),
});

export default companySemestersSlice.reducer;
export const { selectAll: selectAllCompanySemesters } =
  legoAdapter.getSelectors((state: RootState) => state.companySemesters);

export const selectCompanySemestersForInterestForm = createSelector(
  selectAllCompanySemesters,
  (companySemesters) =>
    companySemesters
      .filter((semester) => semester.activeInterestForm)
      .sort(sortSemesterChronologically)
);
