import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { createSelector } from 'reselect';
import type { CompanySemesterContactedStatus, Semester } from 'app/models';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { selectJoblistings } from 'app/reducers/joblistings';
import type { UserEntity } from 'app/reducers/users';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { SemesterStatus, UnknownCompany } from 'app/store/models/Company';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { PublicUser, UnknownUser } from 'app/store/models/User';
import { EntityType } from 'app/store/models/entities';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Company } from '../actions/ActionTypes';
import { selectAllCompanySemesters } from './companySemesters';
import { selectEvents } from './events';
import type { AnyAction } from '@reduxjs/toolkit';

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
export type SubmitCompanyEntity = BaseCompanyEntity & {
  studentContact?: number;
};

const legoAdapter = createLegoAdapter(EntityType.Companies, {
  fetchActions: [Company.FETCH],
  deleteActions: [Company.DELETE],
  sortComparer: (a, b) => (a.name < b.name ? -1 : 1),
});

const companiesSlice = createSlice({
  name: EntityType.Companies,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers((builder) => {
    addCommentCases(EntityType.Companies, builder.addCase);

    builder.addCase(
      Company.ADD_SEMESTER_STATUS.SUCCESS,
      (state, action: AnyAction) => {
        const company = state.entities[action.meta.companyId];
        if (company && 'semesterStatuses' in company) {
          company.semesterStatuses ??= [];
          company.semesterStatuses.push(action.payload);
        }
      }
    );
    builder.addCase(
      Company.EDIT_SEMESTER_STATUS.SUCCESS,
      (state, action: AnyAction) => {
        const { companyId, semesterStatusId } = action.meta;
        const company = state.entities[companyId];
        if (company && 'semesterStatuses' in company) {
          company.semesterStatuses ??= [];
          const index = company.semesterStatuses.findIndex(
            (semesterStatus) => semesterStatus.id === semesterStatusId
          );
          company.semesterStatuses[index] = action.payload;
        }
      }
    );
    builder.addCase(
      Company.DELETE_SEMESTER_STATUS.SUCCESS,
      (state, action: AnyAction) => {
        const { companyId, semesterStatusId } = action.meta;
        const company = state.entities[companyId];
        if (
          company &&
          'semesterStatuses' in company &&
          company.semesterStatuses
        ) {
          company.semesterStatuses = company.semesterStatuses.filter(
            (semesterStatus) => semesterStatus.id === semesterStatusId
          );
        }
      }
    );
    builder.addCase(
      Company.ADD_COMPANY_CONTACT.SUCCESS,
      (state, action: AnyAction) => {
        const company = state.entities[action.meta.companyId];
        if (company && 'companyContacts' in company) {
          company.companyContacts = company.companyContacts.concat(
            action.payload
          );
        }
      }
    );
    builder.addCase(
      Company.EDIT_COMPANY_CONTACT.SUCCESS,
      (state, action: AnyAction) => {
        const { companyId, id } = action.meta;
        const company = state.entities[companyId];
        if (company && 'companyContacts' in company) {
          const index = company.companyContacts.findIndex(
            (companyContact) => companyContact.id === id
          );
          company.companyContacts[index] = action.payload;
        }
      }
    );
    builder.addCase(
      Company.DELETE_COMPANY_CONTACT.SUCCESS,
      (state, action: AnyAction) => {
        const { companyId, companyContactId } = action.meta;
        const company = state.entities[companyId];
        if (company && 'companyContacts' in company) {
          company.companyContacts = company.companyContacts.filter(
            (companyContact) => companyContact.id !== companyContactId
          );
        }
      }
    );
  }),
});

export default companiesSlice.reducer;

const { selectEntities, selectIds, selectAll, selectById } =
  legoAdapter.getSelectors((state: RootState) => state.companies);
export {
  selectEntities as selectCompanyEntities,
  selectIds as selectCompanyIds,
};

export const selectCompanies = createSelector(
  selectAll,
  (state: RootState) => state.users.byId,
  selectAllCompanySemesters,
  (companies, usersById, companySemesters) => {
    return companies.map((company) => ({
      ...company,
      studentContact:
        'studentContact' in company &&
        company.studentContact &&
        usersById[company.studentContact]
          ? usersById[company.studentContact]
          : undefined,
      semesterStatuses:
        company && 'semesterStatuses' in company && company.semesterStatuses
          ? selectSemesterStatuses(company.semesterStatuses, companySemesters)
          : undefined,
    }));
  }
);
export const selectActiveCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies.filter((company) => 'active' in company && company.active)
);

const selectSemesterStatuses = (
  semesterStatuses: SemesterStatus[],
  companySemesters: CompanySemester[]
) =>
  (semesterStatuses || []).map((semester) => {
    const companySemester = companySemesters.find(
      (companySemester) => companySemester.id === semester.semester
    );
    return {
      ...semester,
      year: companySemester?.year,
      semester: companySemester?.semester,
    };
  });

export const selectCompanyById = createSelector(
  selectCompanies,
  (_: RootState, props: { companyId: ID }) => props.companyId,
  (companies, companyId) => {
    return companies.find((company) => company.id === companyId);
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
