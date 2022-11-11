import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { addSemester, fetchSemesters } from 'app/actions/CompanyActions';
import { sortSemesterChronologically } from 'app/routes/companyInterest/utils';
import type CompanySemester from 'app/store/models/CompanySemester';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type CompanySemesterEntity = CompanySemester;

export type CompanySemestersState = EntityReducerState<CompanySemester>;

const initialState: CompanySemestersState = getInitialEntityReducerState();

const companySemestersSlice = createSlice({
  name: EntityType.CompanySemesters,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // TODO: This can be removed by using { types: mutate: addSemester } above and adding the companySemester schema to the addSemester action (NB! this will change the return type of the action)
    builder.addCase(addSemester.success, (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.items.push(action.payload.id);
    });

    addEntityReducer(builder, EntityType.CompanySemesters, {
      fetch: fetchSemesters,
      // mutate: addSemester,
    });
  },
});

export default companySemestersSlice.reducer;

export const selectCompanySemesters = createSelector(
  (state: RootState) => state.companySemesters.items,
  (state: RootState) => state.companySemesters.byId,
  (semesterIds, semestersById) => {
    return !semesterIds || !semestersById
      ? []
      : semesterIds.map((id) => semestersById[id]);
  }
);

export const selectCompanySemestersForInterestForm = createSelector(
  selectCompanySemesters,
  (companySemesters) =>
    companySemesters
      .filter((semester) => semester.activeInterestForm)
      .sort(sortSemesterChronologically)
);
