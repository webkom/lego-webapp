import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  createCompanyInterest,
  deleteCompanyInterest,
  fetch,
  fetchAll,
} from 'app/actions/CompanyInterestActions';
import type { ID } from 'app/store/models';
import type CompanyInterest from 'app/store/models/CompanyInterest';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type CompanyInterestEntity = CompanyInterest;

export type CompanyInterestsState = EntityReducerState<CompanyInterest>;

const initialState: CompanyInterestsState = getInitialEntityReducerState();

const companyInterestsSlice = createSlice({
  name: EntityType.CompanyInterests,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(builder, EntityType.CompanyInterests, {
      fetch: [fetchAll, fetch],
      mutate: createCompanyInterest,
      delete: deleteCompanyInterest,
    });
  },
});

export default companyInterestsSlice.reducer;

export const selectCompanyInterestList = createSelector(
  (state: RootState) => state.companyInterest.byId,
  (state: RootState) => state.companyInterest.items,
  (_: RootState, semesterId: ID) => semesterId,
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
  (state: RootState) => state.companyInterest.byId,
  (_: RootState, companyInterestId: ID) => companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
