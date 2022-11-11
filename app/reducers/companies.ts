import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { createSelector } from 'reselect';
import {
  addCompany,
  addCompanyContact,
  addSemesterStatus,
  deleteCompany,
  deleteCompanyContact,
  deleteSemesterStatus,
  editCompanyContact,
  editSemesterStatus,
  fetch,
  fetchAdmin,
  fetchAll,
  fetchAllAdmin,
} from 'app/actions/CompanyActions';
import type { CompanySemesterContactedStatus, Semester } from 'app/models';
import { addMutateCommentsReducer } from 'app/reducers/comments';
import { selectJoblistings } from 'app/reducers/joblistings';
import type { ID } from 'app/store/models';
import type Company from 'app/store/models/Company';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';
import { selectCompanySemesters } from './companySemesters';
import { selectEvents } from './events';

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
export type CompanyEntity = Company;
export type SubmitCompanyEntity = Omit<Company, 'id'> & {
  studentContact?: number;
};

export type CompaniesState = EntityReducerState<Company>;

const initialState: CompaniesState = getInitialEntityReducerState();

const companiesSlice = createSlice({
  name: EntityType.Companies,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompany.success, (state, action) => {
        state.items = state.items.filter((id) => id !== action.meta.id);
      })
      .addCase(addSemesterStatus.success, (state, action) => {
        state.byId[action.meta.companyId].semesterStatuses =
          state.byId[action.meta.companyId].semesterStatuses || [];
        state.byId[action.meta.companyId].semesterStatuses.push(action.payload);
      })
      .addCase(editSemesterStatus.success, (state, action) => {
        const { companyId, semesterStatusId } = action.meta;
        const index = state.byId[companyId].semesterStatuses.findIndex(
          (s) => s.id === semesterStatusId
        );
        state.byId[companyId].semesterStatuses[index] = action.payload;
      })
      .addCase(deleteSemesterStatus.success, (state, action) => {
        const companyId = action.meta.companyId;
        state.byId[companyId].semesterStatuses = state.byId[
          companyId
        ].semesterStatuses.filter(
          (status) => status.id !== action.meta.semesterStatusId
        );
      })
      .addCase(addCompanyContact.success, (state, action) => {
        state.byId[action.meta.companyId].companyContacts = (
          state.byId[action.meta.companyId].companyContacts || []
        ).concat(action.payload);
      })
      .addCase(editCompanyContact.success, (state, action) => {
        const companyId = action.meta.companyId;
        const index = state.byId[companyId].companyContacts.findIndex(
          (cc) => cc.id === action.payload.id
        );
        state.byId[companyId].companyContacts[index] = action.payload;
      })
      .addCase(deleteCompanyContact.success, (state, action) => {
        const companyId = action.meta.companyId;
        state.byId[companyId].companyContacts = state.byId[
          companyId
        ].companyContacts.filter(
          (contact) => contact.id !== action.meta.companyContactId
        );
      });

    addEntityReducer(builder, EntityType.Companies, {
      fetch: [fetch, fetchAdmin, fetchAll, fetchAllAdmin],
      mutate: addCompany,
      delete: deleteCompany,
    });

    addMutateCommentsReducer(builder, EntityType.Companies);
  },
});

export default companiesSlice.reducer;

export const selectCompanies = createSelector(
  (state: RootState) => state.companies.items,
  (state: RootState) => state.companies.byId,
  (state: RootState) => state.users.byId,
  (state: RootState) => state,
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
  (_: RootState, props: { companyId: ID }) => props.companyId,
  (companies, companyId) => {
    const company = companies.find((company) => company.id === companyId);
    return company || {};
  }
);

export const selectEventsForCompany = createSelector(
  (state: RootState) => selectEvents(state),
  (state: RootState, props: { companyId: ID }) => props.companyId,
  (events, companyId) => {
    if (!companyId || !events) return [];
    return events.filter(
      (event) => event.company && Number(event.company.id) === Number(companyId)
    );
  }
);
export const selectJoblistingsForCompany = createSelector(
  (state: RootState, props: { companyId: ID }) => props.companyId,
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
  (state: RootState, props: { companyId: ID; companyContactId: ID }) =>
    selectCompanyById(state, props),
  (state: RootState, props: { companyId: ID; companyContactId: ID }) =>
    props.companyContactId,
  (company, companyContactId) => {
    if (!company || !company.companyContacts) return {};
    return company.companyContacts.find(
      (contact) => contact.id === companyContactId
    );
  }
);
export const selectCommentsForCompany = createSelector(
  selectCompanyById,
  (state: RootState) => state.comments.byId,
  (company, commentsById) => {
    if (!company || !commentsById) return [];
    return (company.comments || []).map((commentId) => commentsById[commentId]);
  }
);
