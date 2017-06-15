import { createSelector } from 'reselect';
import { CompanyInterestForm } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type CompanyInterestEntity = {
  id: number,
  name: string,
  mail: string,
  contactPerson: string
};

export default createEntityReducer({
  key: 'companyInterestList',
  types: {
    fetch: CompanyInterestForm.FETCH_ALL
  },
  mutate(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
});

export const selectCompanyInterestList = createSelector(
  state => state.companyInterestList.byId,
  state => state.companyInterestList.items,
  (companyInterestById, companyInterestIds) =>
    companyInterestIds.map(id => companyInterestById[id])
);
