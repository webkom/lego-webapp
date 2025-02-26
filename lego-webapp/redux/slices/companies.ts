import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Company } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addCommentCases } from '~/redux/slices/comments';
import { selectAllJoblistings } from '~/redux/slices/joblistings';
import { isNotNullish } from '~/utils';
import { selectCompanySemesterEntities } from './companySemesters';
import { selectAllEvents } from './events';
import { selectUserEntities } from './users';
import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from 'app/models';
import type { AnyAction } from 'redux';
import type { Overwrite } from 'utility-types';
import type {
  AdminDetailCompany,
  AdminListCompany,
  SemesterStatus,
  StudentCompanyContact,
  UnknownCompany,
} from '~/redux/models/Company';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { ListEvent } from '~/redux/models/Event';
import type { PublicUser, UnknownUser } from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

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

export const {
  selectAll: selectAllCompanies,
  selectById: selectCompanyById,
  selectAllPaginated: selectAllPaginatedCompanies,
} = legoAdapter.getSelectors((state: RootState) => state.companies);

export type TransformedStudentCompanyContact = Overwrite<
  StudentCompanyContact,
  { semester: CompanySemester; user: PublicUser }
>;

export type TransformedSemesterStatus = Overwrite<
  SemesterStatus,
  { semester: Semester }
> & { year: number };

export type TransformedAdminCompany<
  T extends AdminDetailCompany | AdminListCompany =
    | AdminDetailCompany
    | AdminListCompany,
> = Overwrite<
  T,
  {
    studentContacts?: TransformedStudentCompanyContact[];
    semesterStatuses: TransformedSemesterStatus[];
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
  semesterStatuses: transformSemesterStatuses(
    companySemesterEntities,
    company.semesterStatuses ?? [],
  ),
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

export const selectActiveCompanies = createSelector(
  selectAllCompanies,
  (companies) =>
    companies.filter((company) => 'active' in company && company.active),
) as <T extends UnknownCompany>(state: RootState) => T[];

export const transformSemesterStatuses = (
  companySemesterEntities: Record<EntityId, CompanySemester>,
  semesterStatuses: SemesterStatus[],
) =>
  semesterStatuses.map((semesterStatus) => {
    const companySemester = companySemesterEntities[semesterStatus.semester];
    return {
      ...semesterStatus,
      year: companySemester?.year,
      semester: companySemester?.semester,
    };
  });

export const selectEventsForCompany = createSelector(
  selectAllEvents<ListEvent>,
  (_: RootState, companyId: EntityId) => companyId,
  (events, companyId) => {
    if (!companyId || !events) return [];
    return events.filter(
      (event) =>
        event.company && Number(event.company.id) === Number(companyId),
    );
  },
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
