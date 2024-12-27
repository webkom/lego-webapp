import callAPI from 'app/actions/callAPI';
import {
  companySchema,
  companySemesterSchema,
  eventSchema,
} from 'app/reducers';
import { semesterToText } from 'app/routes/bdb/components/companyInterest/utils';
import createQueryString from 'app/utils/createQueryString';
import { Company, Event } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { FormValues as CompanyContactEditorFormValues } from 'app/routes/bdb/components/CompanyContactEditor';
import type { Semester } from 'app/store/models';
import type {
  AdminListCompany,
  CompanyContact,
  DetailedCompany,
  DetailedSemesterStatus,
  ListCompany,
  SemesterStatus,
} from 'app/store/models/Company';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { ParsedQs } from 'qs';

export const fetchAll = ({
  fetchMore,
  query,
}: {
  fetchMore: boolean;
  query: ParsedQs;
}) => {
  return callAPI<ListCompany[]>({
    types: Company.FETCH,
    endpoint: '/companies/',
    schema: [companySchema],
    query,
    pagination: {
      fetchNext: fetchMore,
    },
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
    },
    propagateError: true,
  });
};

export function fetchAllAdmin(query = {}, next: boolean = false) {
  return callAPI<AdminListCompany[]>({
    types: Company.FETCH,
    endpoint: `/bdb/`,
    schema: [companySchema],
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
    },
    propagateError: true,
    query: query,
    pagination: {
      fetchNext: next,
    },
  });
}

export function fetch(companyId: EntityId) {
  return callAPI<DetailedCompany>({
    types: Company.FETCH,
    endpoint: `/companies/${companyId}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Henting av en bedrift feilet',
    },
    propagateError: true,
  });
}

export function fetchAdmin(companyId: EntityId) {
  return callAPI({
    types: Company.FETCH,
    endpoint: `/bdb/${companyId}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Henting av en bedrift feilet',
    },
    propagateError: true,
  });
}

export const fetchEventsForCompany = ({
  endpoint,
  queryString,
}: {
  endpoint: string;
  queryString: string;
}) => {
  return callAPI({
    types: Event.FETCH,
    endpoint,
    schema: [eventSchema],
    meta: {
      queryString,
      errorMessage: 'Henting av tilknyttede arrangementer feilet',
    },
  });
};

export function addCompany(data: Record<string, any>) {
  return callAPI<DetailedCompany>({
    types: Company.ADD,
    endpoint: '/bdb/',
    method: 'POST',
    body: data,
    schema: companySchema,
    meta: {
      successMessage: 'Bedrift lagt til',
      errorMessage: 'Legg til bedrift feilet',
    },
  });
}

export function editCompany({ companyId, ...data }: Record<string, any>) {
  return callAPI<DetailedCompany>({
    types: Company.EDIT,
    endpoint: `/bdb/${companyId}/`,
    method: 'PATCH',
    body: data,
    schema: companySchema,
    meta: {
      successMessage: 'Bedrift oppdatert',
      errorMessage: 'Endring av bedrift feilet',
    },
  });
}

export function deleteCompany(companyId: EntityId) {
  return callAPI({
    types: Company.DELETE,
    endpoint: `/bdb/${companyId}/`,
    method: 'DELETE',
    meta: {
      id: Number(companyId),
      errorMessage: 'Sletting av bedrift feilet',
    },
  });
}

export function addSemesterStatus({
  companyId,
  ...data
}: {
  companyId: EntityId;
} & Omit<SemesterStatus, 'id'>) {
  return callAPI<DetailedSemesterStatus>({
    types: Company.ADD_SEMESTER_STATUS,
    endpoint: `/companies/${companyId}/semester-statuses/`,
    method: 'POST',
    body: data,
    meta: {
      errorMessage: 'Legg til semesterstatus feilet',
      companyId,
    },
  });
}

export function editSemesterStatus({
  companyId,
  semesterStatusId,
  ...data
}: {
  companyId: EntityId;
  semesterStatusId: EntityId;
} & Partial<SemesterStatus>) {
  return callAPI<DetailedSemesterStatus>({
    types: Company.EDIT_SEMESTER_STATUS,
    endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
    method: 'PATCH',
    body: data,
    meta: {
      errorMessage: 'Endring av semester status feilet',
      companyId,
      semesterStatusId,
    },
  });
}

export function deleteSemesterStatus(
  companyId: EntityId,
  semesterStatusId: EntityId,
) {
  return callAPI({
    types: Company.DELETE_SEMESTER_STATUS,
    endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
    method: 'DELETE',
    meta: {
      companyId,
      semesterStatusId,
      errorMessage: 'Sletting av semesterstatus feilet',
      successMessage: 'Semesterstatus slettet',
    },
  });
}

export function fetchCompanyContacts(companyId: EntityId) {
  return callAPI<{ results: CompanyContact[] }>({
    types: Company.FETCH_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av bedriftskontakt feilet',
    },
  });
}

type CompanyContactEditorSubmitBody = {
  companyId: EntityId;
  companyContactId?: EntityId;
} & CompanyContactEditorFormValues;

export function addCompanyContact({
  companyId,
  name,
  role,
  mail,
  phone,
}: CompanyContactEditorSubmitBody) {
  return callAPI<CompanyContact>({
    types: Company.ADD_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'POST',
    body: {
      name,
      role,
      mail,
      phone,
    },
    meta: {
      errorMessage: 'Legg til bedriftskontakt feilet',
      companyId,
    },
  });
}

export function editCompanyContact({
  companyId,
  companyContactId,
  name,
  role,
  mail,
  phone,
}: CompanyContactEditorSubmitBody) {
  return callAPI<CompanyContact>({
    types: Company.EDIT_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
    method: 'PATCH',
    body: {
      name,
      role,
      mail,
      phone,
    },
    meta: {
      errorMessage: 'Endring av bedriftskontakt feilet',
      companyId,
    },
  });
}

export function deleteCompanyContact(
  companyId: EntityId,
  companyContactId: EntityId,
) {
  return callAPI({
    types: Company.DELETE_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
    method: 'DELETE',
    meta: {
      companyId,
      companyContactId,
      errorMessage: 'Sletting av bedriftskontakt feilet',
      successMessage: 'Bedriftskontakt slettet',
    },
  });
}

export function fetchSemestersForInterestform() {
  return fetchSemesters({
    company_interest: 'True',
  });
}

export function fetchSemesters(queries: Record<string, string> = {}) {
  return callAPI<CompanySemester[]>({
    types: Company.FETCH_SEMESTERS,
    endpoint: `/company-semesters/${createQueryString(queries)}`,
    schema: [companySemesterSchema],
    meta: {
      errorMessage: 'Henting av semestre feilet',
    },
    propagateError: true,
  });
}

export function addSemester({
  year,
  semester,
}: Pick<CompanySemester, 'year' | 'semester'>) {
  return callAPI<DetailedSemesterStatus>({
    types: Company.ADD_SEMESTER,
    endpoint: `/company-semesters/`,
    method: 'POST',
    schema: companySemesterSchema,
    body: {
      year,
      semester,
      activeInterestForm: true,
    },
    meta: {
      errorMessage: 'Legge til semester feilet',
      successMessage: 'Semester lagt til!',
    },
  });
}

export function editSemester({
  id,
  year,
  semester,
  activeInterestForm,
}: {
  id: EntityId;
  year: number;
  semester: Semester;
  activeInterestForm: boolean;
}) {
  return callAPI<DetailedSemesterStatus>({
    types: Company.EDIT_SEMESTER,
    endpoint: `/company-semesters/${id}/`,
    method: 'PATCH',
    schema: companySemesterSchema,
    body: {
      id,
      year,
      semester,
      activeInterestForm,
    },
    meta: {
      errorMessage: 'Endring av semester feilet',
      successMessage: `${semesterToText({
        semester,
        year,
        language: 'norwegian',
      })} er nå ${activeInterestForm ? 'aktivt' : 'deaktivert'}!`,
    },
  });
}
