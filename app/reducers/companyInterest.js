import { createSelector } from 'reselect';
import { CompanyInterestForm } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type CompanyInterestEntity = {
  id: number,
  companyName: string,
  mail: string,
  contactPerson: string,
  companyPresentation: boolean,
  course: boolean,
  lunchPresentation: boolean,
  readme: boolean,
  collaboration: boolean,
  itdagene: boolean,
  comment: boolean
};

export default createEntityReducer({
  key: 'companyInterest',
  types: {
    fetch: CompanyInterestForm.FETCH_ALL,
    mutate: CompanyInterestForm.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case CompanyInterestForm.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.companyInterestId !== id)
        };
      default:
        return state;
    }
  }
});

export const selectCompanyInterestList = createSelector(
  state => state.companyInterest.byId,
  state => state.companyInterest.items,
  (companyInterestById, companyInterestIds) =>
    companyInterestIds.map(id => companyInterestById[id])
);

export const selectCompanyInterestById = createSelector(
  state => state.companyInterest.byId,
  (state, props) => props.companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
