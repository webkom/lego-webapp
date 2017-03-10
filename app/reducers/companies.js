import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { selectEvents } from './events';

export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Company.FETCH,
    mutate: Company.ADD
  },
  mutate(state, action) {
    switch (action.type) {
      case Company.DELETE.SUCCESS: {
        return {
          ...state,
          byId: state.byId.filter(
            company => company.id !== Number(action.meta.companyId)
          )
        };
      }

      case Company.DELETE_SEMESTER.SUCCESS: {
        const companyId = Number(action.meta.companyId);
        return {
          ...state,
          byId: {
            ...state.byId,
            [companyId]: {
              ...state.byId[companyId],
              semesterStatuses: state.byId[companyId].semesterStatuses.filter(
                status => status.id !== Number(action.meta.semesterId)
              )
            }
          }
        };
      }

      case Company.DELETE_COMPANY_CONTACT.SUCCESS: {
        const companyId = Number(action.meta.companyId);
        return {
          ...state,
          byId: {
            ...state.byId,
            [companyId]: {
              ...state.byId[companyId],
              companyContacts: state.byId[companyId].companyContacts.filter(
                contact => contact.id !== Number(action.meta.companyContactId)
              )
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
  state => state.companies.items,
  state => state.companies.byId,
  state => state.users.byId,
  (companyIds, companiesById, usersById) =>
    companyIds.map(companyId => ({
      ...companiesById[companyId],
      studentContact: usersById
        ? usersById[companiesById[companyId].studentContact]
        : {}
    }))
);

export const selectCompanyById = createSelector(
  selectCompanies,
  (state, props) => props.companyId,
  (companies, companyId) =>
    companies.find(company => company.id === Number(companyId)) || {}
);

export const selectEventsForCompany = createSelector(
  selectCompanyById,
  selectEvents,
  (company, events) => {
    if (!company || events) return [];
    return events.filter(event => event.company === company.id);
  }
);

export const selectCompanyContact = createSelector(
  selectCompanyById,
  (state, props) => props.companyContactId,
  (company, companyContactId) => {
    if (!company) return [];
    return company.companyContacts.filter(
      contact => contact.id === companyContactId
    );
  }
);

export const selectCommentsForCompany = createSelector(
  selectCompanyById,
  state => state.comments.byId,
  (company, commentsById) => {
    if (!company || !commentsById) return [];
    return (company.comments || []).map(commentId => commentsById[commentId]);
  }
);
