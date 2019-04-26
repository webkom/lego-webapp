import { createSelector } from 'reselect';
import { CompanyInterestForm } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

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
  (state, props) => props,
  (companyInterestById, companyInterestIds, semesterId) => {
    const companyInterests = companyInterestIds.map(
      id => companyInterestById[id]
    );
    if (semesterId === 0) {
      return companyInterests;
    }
    return companyInterests.filter(companyInterest =>
      companyInterest.semesters.includes(semesterId)
    );
  }
);

export const selectCompanyInterestById = createSelector(
  state => state.companyInterest.byId,
  (state, props) => props.companyInterestId,
  (companyInterestById, companyInterestId) =>
    companyInterestById[companyInterestId]
);
