import { createSelector } from 'reselect';

export const selectCompanyInterestList = createSelector(
  state => state.companyInterestList.byId,
  state => state.companyInterestList.items,
  (companyInterestById, companyInterestIds) =>
    companyInterestIds.map(id => companyInterestById[id])
);
