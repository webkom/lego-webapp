import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { selectJoblistings } from 'app/reducers/joblistings';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Company } from '../actions/ActionTypes';
import { selectCompanySemesters } from './companySemesters';
import { selectEvents } from './events';
import type { AnyAction } from '@reduxjs/toolkit';
import type { CompanySemesterContactedStatus, Semester } from 'app/models';
import type { UserEntity } from 'app/reducers/users';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { AnySemesterStatus } from 'app/store/models/Company';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export type BaseSemesterStatusEntity = {
  id?: number;
  companyId?: number;
  semester?: number;
  contactedStatus: Array<CompanySemesterContactedStatus>;
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

const legoAdapter = createLegoAdapter(EntityType.Companies, {
  sortComparer: (a, b) => (a.name < b.name ? -1 : 1),
});

const companiesSlice = createSlice({
  name: 'companies',
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Company.FETCH],
    deleteActions: [Company.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Companies, addCase);
      addCase(
        Company.ADD_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId];
          if (company) {
            company.semesterStatuses ??= [];
            company.semesterStatuses.push(action.payload);
          }
        }
      );
      addCase(
        Company.EDIT_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterStatusId } = action.meta;
          const company = state.entities[companyId];
          if (company && company.semesterStatuses) {
            const index = company.semesterStatuses.findIndex(
              (s) => s.id === semesterStatusId
            );
            company.semesterStatuses[index] = action.payload;
          }
        }
      );
      addCase(
        Company.DELETE_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterStatusId } = action.meta;
          const company = state.entities[companyId];
          if (company) {
            company.semesterStatuses = company.semesterStatuses?.filter(
              (s) => s.id !== semesterStatusId
            );
          }
        }
      );
      addCase(
        Company.ADD_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId];
          if (company) {
            company.companyContacts ??= [];
            company.companyContacts.push(action.payload);
          }
        }
      );
      addCase(
        Company.EDIT_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId];
          if (company && company.companyContacts) {
            const index = company.companyContacts.findIndex(
              (cc) => cc.id === action.payload.id
            );
            company.companyContacts[index] = action.payload;
          }
        }
      );
      addCase(
        Company.DELETE_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, companyContactId } = action.meta;
          const company = state.entities[companyId];
          if (company) {
            company.companyContacts = company.companyContacts?.filter(
              (cc) => cc.id !== companyContactId
            );
          }
        }
      );
    },
  }),
});

export default companiesSlice.reducer;

const { selectAll: selectAllCompanies } = legoAdapter.getSelectors(
  (state: RootState) => state.companies
);

export const selectCompanies = createSelector(
  selectAllCompanies,
  (state: RootState) => state.users.byId,
  selectCompanySemesters,
  (allCompanies, usersById, companySemesters) =>
    allCompanies.map((company) => ({
      ...company,
      studentContact: company.studentContact
        ? usersById[company.studentContact]
        : undefined,
      semesterStatuses: selectSemesterStatuses(
        company.semesterStatuses ?? [],
        companySemesters
      ),
    }))
);

export const selectActiveCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies.filter((company) => 'active' in company && company.active)
);

const selectSemesterStatuses = (
  semesterStatuses: AnySemesterStatus[],
  companySemesters: CompanySemester[]
) =>
  semesterStatuses.map((semester) => {
    const companySemester = companySemesters.find(
      (companySemester) => companySemester.id === semester.semester
    );
    return companySemester
      ? {
          ...semester,
          year: companySemester.year,
          semester: companySemester.semester,
        }
      : semester;
  });

export const selectCompanyById = createSelector(
  selectCompanies,
  (_: RootState, props: { companyId: ID }) => props.companyId,
  (companies, companyId) => {
    return companies.find((company) => company.id === companyId) || {};
  }
);
export const selectEventsForCompany = createSelector(
  selectEvents,
  (_: RootState, props: { companyId: ID }) => props.companyId,
  (events, companyId) => {
    if (!companyId || !events) return [];
    return events.filter(
      (event) => event.company && Number(event.company.id) === Number(companyId)
    );
  }
);
export const selectJoblistingsForCompany = createSelector(
  (_: RootState, props: { companyId: ID }) => props.companyId,
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
  selectCompanyById,
  (_: RootState, props: { companyContactId: ID }) => props.companyContactId,
  (company, companyContactId) => {
    if (!company || !company.companyContacts) return {};
    return company.companyContacts.find(
      (contact) => contact.id === companyContactId
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
