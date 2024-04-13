import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { createSelector } from 'reselect';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { selectAllJoblistings } from 'app/reducers/joblistings';
import { selectUserEntities } from 'app/reducers/users';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Company } from '../actions/ActionTypes';
import { selectAllCompanySemesters } from './companySemesters';
import { selectEvents } from './events';
import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from 'app/models';
import type { UserEntity } from 'app/reducers/users';
import type { RootState } from 'app/store/createRootReducer';
import type {
  AdminDetailCompany,
  CompanySemesterContactStatus,
} from 'app/store/models/Company';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { AnyAction } from 'redux';

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

const legoAdapter = createLegoAdapter(EntityType.Companies);
const companiesSlice = createSlice({
  name: EntityType.Companies,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Company.FETCH],
    deleteActions: [Company.DELETE],
    extraCases: (addCase) => {
      addCase(
        Company.ADD_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.semesterStatuses ??= [];
          company.semesterStatuses.push(action.payload);
        },
      );
      addCase(
        Company.EDIT_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterStatusId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          const index = company.semesterStatuses?.findIndex(
            (s) => s.id === semesterStatusId,
          );
          if (index === undefined || company.semesterStatuses === undefined)
            return;
          company.semesterStatuses[index] = action.payload;
        },
      );
      addCase(
        Company.DELETE_SEMESTER_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterStatusId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.semesterStatuses = company.semesterStatuses?.filter(
            (status) => status.id !== semesterStatusId,
          );
        },
      );

      addCase(
        Company.ADD_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.companyContacts ??= [];
          company.companyContacts.push(action.payload);
        },
      );
      addCase(
        Company.EDIT_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          const index = company.companyContacts?.findIndex(
            (cc) => cc.id === action.payload.id,
          );
          if (index === undefined) return;
          company.companyContacts[index] = action.payload;
        },
      );
      addCase(
        Company.DELETE_COMPANY_CONTACT.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, companyContactId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.companyContacts = company.companyContacts?.filter(
            (status) => status.id !== companyContactId,
          );
        },
      );

      addCommentCases(EntityType.Companies, addCase);
    },
  }),
});

export default companiesSlice.reducer;

export const { selectAll: selectAllCompanies } = legoAdapter.getSelectors(
  (state: RootState) => state.companies,
);

export const selectCompanies = createSelector(
  selectAllCompanies,
  selectUserEntities,
  selectAllCompanySemesters,
  (companies, userEntities, companySemesters) => {
    return companies
      .map((company) => ({
        ...company,
        studentContact:
          'studentContact' in company && company.studentContact
            ? userEntities[company.studentContact]
            : undefined,
        semesterStatuses:
          'semesterStatuses' in company
            ? selectSemesterStatuses(company.semesterStatuses, companySemesters)
            : undefined,
      }))
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  },
);
export const selectActiveCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies.filter((company) => 'active' in company && company.active),
);

const selectSemesterStatuses = (semesterStatuses, companySemesters) =>
  (semesterStatuses || []).map((semester) => {
    const companySemester = companySemesters.find(
      (companySemester) => companySemester.id === semester.semester,
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
  (_: RootState, companyId?: EntityId) => companyId,
  (companies, companyId) => {
    return companies.find((company) => company.id === Number(companyId));
  },
);
export const selectEventsForCompany = createSelector(
  (state, props) => selectEvents(state, props),
  (state, props) => props.companyId,
  (events, companyId) => {
    if (!companyId || !events) return [];
    return events.filter(
      (event) =>
        event.company && Number(event.company.id) === Number(companyId),
    );
  },
);
export const selectJoblistingsForCompany = createSelector(
  (state, props) => props.companyId,
  selectAllJoblistings,
  (companyId, joblistings) => {
    if (!companyId || !joblistings) return [];
    return joblistings.filter(
      (joblisting) =>
        joblisting.company &&
        Number(joblisting.company.id) === Number(companyId),
    );
  },
);

export const selectCompanyContactById = createSelector(
  selectCompanyById,
  (_: RootState, companyId?: EntityId, companyContactId?: EntityId) =>
    companyContactId,
  (company, companyContactId) => {
    if (!company || !('companyContacts' in company)) return;
    return company.companyContacts.find(
      (contact) => contact.id === Number(companyContactId),
    );
  },
);
