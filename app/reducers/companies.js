import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Company.FETCH,
    mutate: Company.ADD
  },
  mutate(state, action) {
    switch (action.type) {

      case Company.DELETE_FAILURE: {
        return {
          ...state,
          byId: state.byId.filter((company) => company.id !== action.meta.companyId)
        };
      }

      case Company.DELETE_SEMESTER_FAILURE: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.companyId]: {
              ...state.byId[action.meta.companyId],
              semesterStatuses: state.byId[action.meta.companyId].semesterStatuses
                .filter((status) => status.id !== action.meta.semesterId)
            }
          }
        };
      }

      default:
        return state;
    }
  }
});

export const selectCompanies = createSelector(
  (state) => state.companies.items,
  (state) => state.companies.byId,
  (state) => state.users.byId,
  (companyIds, companiesById, usersById) => (
    companyIds.map((companyId) => ({
      ...companiesById[companyId],
      studentContact: usersById ?
        usersById[companiesById[companyId].studentContact] : {}
    }))
  )
);

export const selectCompanyById = createSelector(
  selectCompanies,
  (state, props) => props.companyId,
  (companies, companyId) => companies.find((company) => company.id === companyId) || {}
);

export const selectEventsForCompany = createSelector(
  selectCompanyById,
  (state) => state.events.byId,
  (company, eventsById) => {
    if (!company) return [];
    return eventsById.filter((event) => event.company === company.id);
  }
);

export const selectCompanyContact = createSelector(
  selectCompanyById,
  (state, props) => props.companyContactId,
  (company, companyContactId) => {
    if (!company) return [];
    return company.companyContacts.filter((contact) => contact.id === companyContactId);
  }
);

export const selectCommentsForCompany = createSelector(
  selectCompanyById,
  (state) => state.comments.byId,
  (company, commentsById) => {
    if (!company || !commentsById) return [];
    return (company.comments || []).map((commentId) => commentsById[commentId]);
  }
);
