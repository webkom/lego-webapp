import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Company } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addCommentCases } from '~/redux/slices/comments';
import { selectAllJoblistings } from '~/redux/slices/joblistings';
import { isNotNullish } from '~/utils';
import { selectCompanySemesterEntities } from './companySemesters';
import { selectUserEntities } from './users';
import type { EntityId, AnyAction } from '@reduxjs/toolkit';
import type { Overwrite } from 'utility-types';
import type { CompanyEventStatistics } from '~/redux/actions/CompanyActions';
import type {
  AdminDetailCompany,
  AdminListCompany,
  StudentCompanyContact,
} from '~/redux/models/Company';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { PublicUser, UnknownUser } from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Companies);

type ExtraCompaniesState = {
  eventStatistics: Record<string, CompanyEventStatistics>;
};

const eventStatisticsKey = (
  companyId: EntityId,
  fromSemesterId: EntityId,
  toSemesterId: EntityId,
) => `${companyId}-${fromSemesterId}-${toSemesterId}`;

const companiesSlice = createSlice({
  name: EntityType.Companies,
  initialState: legoAdapter.getInitialState<ExtraCompaniesState>({
    eventStatistics: {},
  }),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Company.FETCH],
    deleteActions: [Company.DELETE],
    extraCases: (addCase) => {
      addCase(
        Company.ADD_SEMESTER_FILES.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.semesterFiles ??= [];
          company.semesterFiles.push(action.payload);
        },
      );
      addCase(
        Company.EDIT_SEMESTER_FILES.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterFilesId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          const index = company.semesterFiles?.findIndex(
            (files) => files.id === semesterFilesId,
          );
          if (index === undefined || company.semesterFiles === undefined)
            return;
          company.semesterFiles[index] = action.payload;
        },
      );
      addCase(
        Company.DELETE_SEMESTER_FILES.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, semesterFilesId } = action.meta;
          const company = state.entities[companyId] as AdminDetailCompany;
          company.semesterFiles = company.semesterFiles?.filter(
            (files) => files.id !== semesterFilesId,
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

      addCase(
        Company.FETCH_EVENT_STATISTICS.SUCCESS,
        (state, action: AnyAction) => {
          const { companyId, fromSemesterId, toSemesterId } = action.meta;
          state.eventStatistics[
            eventStatisticsKey(companyId, fromSemesterId, toSemesterId)
          ] = action.payload;
        },
      );

      addCommentCases(EntityType.Companies, addCase);
    },
  }),
});

export default companiesSlice.reducer;

export const {
  selectAll: selectAllCompanies,
  selectById: selectCompanyById,
  selectAllPaginated: selectAllPaginatedCompanies,
} = legoAdapter.getSelectors((state: RootState) => state.companies);

export const selectCompanyEventStatistics = (
  state: RootState,
  companyId: EntityId,
  fromSemesterId?: EntityId,
  toSemesterId?: EntityId,
): CompanyEventStatistics | undefined =>
  fromSemesterId === undefined || toSemesterId === undefined
    ? undefined
    : state.companies.eventStatistics[
        eventStatisticsKey(companyId, fromSemesterId, toSemesterId)
      ];

export type TransformedStudentCompanyContact = Overwrite<
  StudentCompanyContact,
  { semester: CompanySemester; user: PublicUser }
>;

export type TransformedAdminCompany<
  T extends AdminDetailCompany | AdminListCompany =
    | AdminDetailCompany
    | AdminListCompany,
> = Overwrite<
  T,
  {
    studentContacts?: TransformedStudentCompanyContact[];
  }
>;
export type TransformedAdminDetailCompany =
  TransformedAdminCompany<AdminDetailCompany>;
const transformCompany = (
  companySemesterEntities: Record<EntityId, CompanySemester>,
  company: AdminDetailCompany | AdminListCompany,
  userEntities?: Record<EntityId, UnknownUser>,
): TransformedAdminCompany => ({
  ...company,
  studentContacts:
    userEntities &&
    company.studentContacts &&
    company.studentContacts.map((studentContact) => ({
      ...studentContact,
      semester: companySemesterEntities[studentContact.semester],
      user: userEntities[studentContact.user],
    })),
});

export const selectTransformedAdminCompanies = createSelector(
  selectAllPaginatedCompanies,
  selectCompanySemesterEntities,
  selectUserEntities,
  (companies, companySemesterEntities, userEntities) => {
    return companies
      .map((company) =>
        'semesterStatuses' in company
          ? transformCompany(companySemesterEntities, company, userEntities)
          : undefined,
      )
      .filter(isNotNullish)
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  },
);

export const selectTransformedAdminCompanyById = createSelector(
  selectCompanyById,
  selectCompanySemesterEntities,
  selectUserEntities,
  (company, companySemesterEntities, userEntities) =>
    company && 'semesterStatuses' in company
      ? (transformCompany(
          companySemesterEntities,
          company,
          userEntities,
        ) as TransformedAdminDetailCompany)
      : undefined,
);

export const selectJoblistingsForCompany = createSelector(
  selectAllJoblistings,
  (_: RootState, companyId?: EntityId) => companyId,
  (joblistings, companyId) => {
    if (!companyId) return [];
    return joblistings.filter(
      (joblisting) =>
        joblisting.company &&
        Number(joblisting.company.id) === Number(companyId),
    );
  },
);
