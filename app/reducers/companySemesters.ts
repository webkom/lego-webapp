import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { sortSemesterChronologically } from 'app/routes/companyInterest/utils';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Company } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.CompanySemesters);

const companySemestersSlice = createSlice({
  name: EntityType.CompanySemesters,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Company.FETCH_SEMESTERS],
  }),
});

export default companySemestersSlice.reducer;

export const {
  selectAll: selectAllCompanySemesters,
  selectEntities: selectCompanySemesterEntities,
  selectById: selectCompanySemesterById,
} = legoAdapter.getSelectors((state: RootState) => state.companySemesters);

export const selectCompanySemestersForInterestForm = createSelector(
  selectAllCompanySemesters,
  (companySemesters) =>
    companySemesters
      .filter((semester) => semester.activeInterestForm)
      .sort(sortSemesterChronologically),
);
