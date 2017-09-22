// @flow

import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { selectEvents } from './events';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';
import { selectCompanySemesters } from './companySemesters';
import { selectUserById } from './users';

function mutateCompanies(state, action) {
  switch (action.type) {
    case Company.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }

    case Company.EDIT.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.optimisticId),
        byId: {
          ...state.byId,
          [action.payload.result]:
            action.payload.entities.companies[action.payload.result]
        }
      };
    }

    case Company.DELETE_SEMESTER_STATUS.SUCCESS: {
      const companyId = action.meta.companyId;
      return {
        ...state,
        byId: {
          ...state.byId,
          [companyId]: {
            ...state.byId[companyId],
            semesterStatuses: state.byId[companyId].semesterStatuses.filter(
              status => status.id !== action.meta.semesterId
            )
          }
        }
      };
    }

    case Company.DELETE_COMPANY_CONTACT.SUCCESS: {
      const companyId = action.meta.companyId;
      return {
        ...state,
        byId: {
          ...state.byId,
          [companyId]: {
            ...state.byId[companyId],
            companyContacts: state.byId[companyId].companyContacts.filter(
              contact => contact.id !== action.meta.companyContactId
            )
          }
        }
      };
    }

    default:
      return state;
  }
}

const mutate = joinReducers(mutateComments('companies'), mutateCompanies);

export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Company.FETCH,
    mutate: Company.ADD
  },
  mutate
});

export const selectCompanies = createSelector(
  state => state.companies.items,
  state => state.companies.byId,
  state => state,
  (companyIds, companiesById, state) => {
    if (companyIds.length === 0) return [];
    const companySemesters = selectCompanySemesters(state);
    return companyIds.map(companyId => ({
      ...companiesById[companyId],
      semesterStatuses:
        companiesById[companyId] &&
        selectSemesterStatuses(
          companiesById[companyId].semesterStatuses,
          companySemesters
        )
    }));
  }
);

const selectSemesterStatuses = (semesterStatuses, companySemesters) =>
  semesterStatuses.map(semester => {
    const companySemester = companySemesters.find(
      companySemester => companySemester.id === semester.semester
    );
    return companySemester
      ? {
          ...semester,
          year: companySemester.year,
          semester: companySemester.semester
        }
      : semester;
  });

export const selectCompanyById = createSelector(
  selectCompanies,
  (state, props) => props.companyId,
  (state, props) => state.users,
  (companies, companyId, users) => {
    const company = companies.find(company => company.id === companyId);
    return company
      ? {
          ...company,
          studentContact: selectUserById(
            { users },
            { userId: company.studentContact }
          )
        }
      : {};
  }
);

export const selectEventsForCompany = createSelector(
  selectCompanyById,
  selectEvents,
  (company, events) => {
    if (!company || !events) return [];
    return events.filter(
      event => event.company && event.company.id === company.id
    );
  }
);

export const selectCompanyContactById = createSelector(
  selectCompanyById,
  (state, props) => props.companyContactId,
  (company, companyContactId) => {
    if (!company || !company.companyContacts) return {};
    return company.companyContacts.find(
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
