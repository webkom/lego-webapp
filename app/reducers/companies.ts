import { produce } from 'immer';
import { createSelector } from 'reselect';
import { mutateComments, selectCommentEntities } from 'app/reducers/comments';
import { selectJoblistings } from 'app/reducers/joblistings';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { Company } from '../actions/ActionTypes';
import { selectCompanySemesters } from './companySemesters';
import { selectEvents } from './events';
import type { Semester } from 'app/models';
import type { UserEntity } from 'app/reducers/users';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export type BaseSemesterStatusEntity = {
  id?: number;
  companyId?: number;
  semester?: number;
  contactedStatus: CompanySemesterContactStatus[];
  contract?: string;
  contractName?: string;
  statistics?: string;
  statisticsName?: string;
  evaluation?: string;
  evaluationName?: string;
};
export type SemesterStatusEntity = BaseSemesterStatusEntity & {
  id: number;
  semester: Semester;
  year: string;
};
export type BaseCompanyContactEntity = {
  id?: number;
  name: string;
  role?: string;
  mail?: string;
  phone?: string;
  mobile?: string;
};
export type CompanyContactEntity = BaseCompanyContactEntity & {
  id: number;
};
export type BaseCompanyEntity = {
  name: string;
  companyId?: number;
  description?: string;
  studentContact?: UserEntity;
  phone?: string;
  companyType?: string;
  website?: string;
  address?: string;
  paymentMail?: string;
  active?: boolean;
  adminComment?: string;
  contentTarget: ContentTarget;
  comments: Array<{
    id: string;
    parent: string;
  }>;
  semesterStatuses: Array<SemesterStatusEntity>;
  logo?: string;
  files?: Array<Record<string, any>>;
  companyContacts: Array<CompanyContactEntity>;
};
export type CompanyEntity = BaseCompanyEntity & {
  id: number;
};
export type SubmitCompanyEntity = BaseCompanyEntity & {
  studentContact?: number;
};
type State = any;

function mutateCompanies(state: State, action) {
  return produce(state, (newState: State): void => {
    switch (action.type) {
      case Company.DELETE.SUCCESS:
        newState.items = newState.items.filter((id) => id !== action.meta.id);
        break;

      case Company.ADD_SEMESTER_STATUS.SUCCESS:
        newState.byId[action.meta.companyId].semesterStatuses =
          newState.byId[action.meta.companyId].semesterStatuses || [];
        newState.byId[action.meta.companyId].semesterStatuses.push(
          action.payload
        );
        break;

      case Company.EDIT_SEMESTER_STATUS.SUCCESS: {
        const { companyId, semesterStatusId } = action.meta;
        const index = newState.byId[companyId].semesterStatuses.findIndex(
          (s) => s.id === semesterStatusId
        );
        newState.byId[companyId].semesterStatuses[index] = action.payload;
        break;
      }

      case Company.DELETE_SEMESTER_STATUS.SUCCESS: {
        const companyId = action.meta.companyId;
        newState.byId[companyId].semesterStatuses = newState.byId[
          companyId
        ].semesterStatuses.filter(
          (status) => status.id !== action.meta.semesterStatusId
        );
        break;
      }

      case Company.ADD_COMPANY_CONTACT.SUCCESS:
        newState.byId[action.meta.companyId].companyContacts = (
          newState.byId[action.meta.companyId].companyContacts || []
        ).concat(action.payload);
        break;

      case Company.EDIT_COMPANY_CONTACT.SUCCESS: {
        const companyId = action.meta.companyId;
        const index = newState.byId[companyId].companyContacts.findIndex(
          (cc) => cc.id === action.payload.id
        );
        newState.byId[companyId].companyContacts[index] = action.payload;
        break;
      }

      case Company.DELETE_COMPANY_CONTACT.SUCCESS: {
        const companyId = action.meta.companyId;
        newState.byId[companyId].companyContacts = newState.byId[
          companyId
        ].companyContacts.filter(
          (contact) => contact.id !== action.meta.companyContactId
        );
        break;
      }

      default:
        break;
    }
  });
}

const mutate = joinReducers(mutateComments('companies'), mutateCompanies);
export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Company.FETCH,
    mutate: Company.ADD,
    delete: Company.DELETE,
  },
  mutate,
});
export const selectCompanies = createSelector(
  (state) => state.companies.items,
  (state) => state.companies.byId,
  (state) => state.users.byId,
  (state) => state,
  (companyIds, companiesById, usersById, state) => {
    if (companyIds.length === 0) return [];
    const companySemesters = selectCompanySemesters(state);
    return companyIds
      .map((companyId) => {
        const company = companiesById[companyId];
        return {
          ...company,
          studentContact: usersById[company.studentContact]
            ? usersById[company.studentContact]
            : company.studentContact,
          semesterStatuses:
            company &&
            selectSemesterStatuses(company.semesterStatuses, companySemesters),
        };
      })
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  }
);
export const selectActiveCompanies = createSelector(
  selectCompanies,
  (companies) => companies.filter((company) => company.active)
);

const selectSemesterStatuses = (semesterStatuses, companySemesters) =>
  (semesterStatuses || []).map((semester) => {
    const companySemester = companySemesters.find(
      (companySemester) => companySemester.id === semester.semester
    );
    return produce(semester, (draft) => {
      if (companySemester) {
        draft.year = companySemester.year;
        draft.semester = companySemester.semester;
      }
    });
  });

export const selectCompanyById = createSelector(
  selectCompanies,
  (state, props) => props.companyId,
  (companies, companyId) => {
    const company = companies.find(
      (company) => company.id === Number(companyId)
    );
    return company || {};
  }
);
export const selectEventsForCompany = createSelector(
  (state, props) => selectEvents(state, props),
  (state, props) => props.companyId,
  (events, companyId) => {
    if (!companyId || !events) return [];
    return events.filter(
      (event) => event.company && Number(event.company.id) === Number(companyId)
    );
  }
);
export const selectJoblistingsForCompany = createSelector(
  (state, props) => props.companyId,
  selectJoblistings,
  (companyId, joblistings) => {
    if (!companyId || !joblistings) return [];
    return joblistings.filter(
      (joblisting) =>
        joblisting.company &&
        Number(joblisting.company.id) === Number(companyId)
    );
  }
);
export const selectCompanyContactById = createSelector(
  (state, props) => selectCompanyById(state, props),
  (state, props) => props.companyContactId,
  (company, companyContactId) => {
    if (!company || !company.companyContacts) return {};
    return company.companyContacts.find(
      (contact) => contact.id === Number(companyContactId)
    );
  }
);
export const selectCommentsForCompany = createSelector(
  selectCompanyById,
  selectCommentEntities,
  (company, commentEntities) => {
    if (!company || !commentEntities) return [];
    return (company.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
