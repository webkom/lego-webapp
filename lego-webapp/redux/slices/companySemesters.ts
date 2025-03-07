import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { sortSemesterChronologically } from '~/pages/(migrated)/bdb/company-interest/utils';
import { Company } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

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
