import { push } from 'connected-react-router';
import { addToast } from 'app/reducers/toasts';
import type { ID } from 'app/store/models';
import type Company from 'app/store/models/Company';
import type { SemesterStatus, CompanyContact } from 'app/store/models/Company';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { EntityType } from 'app/store/models/Entities';
import {
  companySchema,
  companySemesterSchema,
  eventSchema,
  joblistingsSchema,
} from 'app/store/schemas';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';
import createQueryString from 'app/utils/createQueryString';
import { semesterToText } from '../routes/companyInterest/utils';

interface FetchAllCompaniesArgs {
  fetchMore: boolean;
}

export const fetchAll = createLegoApiAction()(
  'Company.FETCH_ALL',
  (_, { fetchMore }: FetchAllCompaniesArgs) => ({
    endpoint: '/companies/',
    schema: [companySchema],
    pagination: {
      fetchNext: fetchMore,
    },
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
      queryString: '',
    },
    propagateError: true,
  })
);

export const fetchAllAdmin = createLegoApiAction()(
  'Company.FETCH_ALL_ADMIN',
  () => ({
    endpoint: '/bdb/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
    },
    propagateError: true,
  })
);

export const fetch = createLegoApiAction()(
  'Company.FETCH',
  (_, id: number) => ({
    endpoint: `/companies/${id}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Henting av en bedrift feilet',
    },
    propagateError: true,
  })
);

export const fetchAdmin = createLegoApiAction()(
  'Company.FETCH_ADMIN',
  (_, id: ID) => ({
    endpoint: `/bdb/${id}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Henting av en bedrift feilet',
    },
    propagateError: true,
  })
);

interface FetchEventsForCompanyArgs {
  queryString: string;
  loadNextPage: boolean;
}

export const fetchEventsForCompany = createLegoApiAction()(
  'Event.FETCH_FOR_COMPANY',
  (
    { getState },
    { queryString, loadNextPage = false }: FetchEventsForCompanyArgs
  ) => {
    const endpoint = loadNextPage
      ? getState().events.pagination[queryString].nextPage
      : `/events/${queryString}`;
    return {
      endpoint,
      schema: [eventSchema],
      meta: {
        queryString,
        errorMessage: 'Henting av tilknyttede arrangementer feilet',
      },
    };
  }
);

export const fetchJoblistingsForCompany = createLegoApiAction()(
  'Joblistings.FETCH_FOR_COMPANY',
  (_, id: ID) => ({
    endpoint: `/joblistings/?company=${id}`,
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Henting av tilknyttede jobbannonser feilet',
    },
  })
);

export const addCompany = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Companies>
>()(
  'Company.ADD',
  (_, company: Company) => ({
    endpoint: '/bdb/',
    method: 'POST',
    body: company,
    schema: companySchema,
    meta: {
      errorMessage: 'Legg til bedrift feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      const id = action.payload.result;
      dispatch(
        addToast({
          message: 'Bedrift lagt til.',
        })
      );
      dispatch(push(`/bdb/${id}`));
    },
  }
);

export const editCompany = createLegoApiAction()(
  'Company.EDIT',
  (_, { companyId, ...data }: Company & { companyId: ID }) => ({
    endpoint: `/bdb/${companyId}/`,
    method: 'PATCH',
    body: data,
    schema: companySchema,
    meta: {
      companyId,
      errorMessage: 'Endring av bedrift feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(
        addToast({
          message: 'Bedrift endret.',
        })
      );
      dispatch(push(`/bdb/${action.meta.companyId}/`));
    },
  }
);

export const deleteCompany = createLegoApiAction()(
  'Company.DELETE',
  (_, id: ID) => ({
    endpoint: `/bdb/${id}/`,
    method: 'DELETE',
    meta: {
      id: Number(id),
      errorMessage: 'Sletting av bedrift feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(
        addToast({
          message: 'Bedrift slettet.',
        })
      );
      dispatch(push('/bdb/'));
    },
  }
);

export const addSemesterStatus = createLegoApiAction<SemesterStatus>()(
  'Company.ADD_SEMESTER_STATUS',
  (
    _,
    { companyId, ...data }: { companyId: ID } & Omit<SemesterStatus, 'id'>,
    options: { detail: boolean } = {
      detail: false,
    }
  ) => ({
    endpoint: `/companies/${companyId}/semester-statuses/`,
    method: 'POST',
    body: data,
    meta: {
      errorMessage: 'Legg til semesterstatus feilet',
      companyId,
      detail: options.detail,
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(
        addToast({
          message: 'Semester status lagt til.',
        })
      );

      if (action.meta.detail) {
        dispatch(push(`/bdb/${action.meta.companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    },
  }
);

export const editSemesterStatus = createLegoApiAction<SemesterStatus>()(
  'Company.EDIT_SEMESTER_STATUS',
  (
    _,
    {
      companyId,
      semesterStatusId,
      ...data
    }: { companyId: ID; semesterStatusId: ID } & Omit<SemesterStatus, 'id'>,
    { detail }: { detail: boolean } = {
      detail: false,
    }
  ) => ({
    endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
    method: 'PATCH',
    body: data,
    meta: {
      errorMessage: 'Endring av semester status feilet',
      successMessage: 'Semesterstatus endret.',
      companyId,
      semesterStatusId,
      detail,
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      if (action.meta.detail) {
        dispatch(push(`/bdb/${action.meta.companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    },
  }
);

export const deleteSemesterStatus = createLegoApiAction()(
  'Company.DELETE_SEMESTER_STATUS',
  (_, companyId: number, semesterStatusId: number) => ({
    endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
    method: 'DELETE',
    meta: {
      companyId,
      semesterStatusId,
      errorMessage: 'Sletting av semesterstatus feilet',
      successMessage: 'Semesterstatus slettet',
    },
  })
);

export const fetchCompanyContacts = createLegoApiAction()(
  'Company.FETCH_COMPANY_CONTACT',
  (_, companyId: ID) => ({
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av bedriftskontakt feilet',
    },
  })
);

export const addCompanyContact = createLegoApiAction<CompanyContact>()(
  'Company.ADD_COMPANY_CONTACT',
  (
    _,
    {
      companyId,
      name,
      role,
      mail,
      phone,
    }: { companyId: ID } & Omit<CompanyContact, 'id'>
  ) => ({
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'POST',
    body: {
      name,
      role,
      mail,
      phone,
    },
    meta: {
      successMessage: 'Bedriftskontakt lagt til.',
      errorMessage: 'Legg til bedriftskontakt feilet',
      companyId,
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/bdb/${action.meta.companyId}/`));
    },
  }
);

export const editCompanyContact = createLegoApiAction<CompanyContact>()(
  'Company.EDIT_COMPANY_CONTACT',
  (
    _,
    {
      companyId,
      companyContactId,
      name,
      role,
      mail,
      phone,
    }: { companyId: ID; companyContactId: ID } & Omit<CompanyContact, 'id'>
  ) => ({
    endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
    method: 'PATCH',
    body: {
      name,
      role,
      mail,
      phone,
    },
    meta: {
      successMessage: 'Bedriftskontakt endret.',
      errorMessage: 'Endring av bedriftskontakt feilet',
      companyId,
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/bdb/${action.meta.companyId}`));
    },
  }
);

export const deleteCompanyContact = createLegoApiAction()(
  'Company.DELETE_COMPANY_CONTACT',
  (_, companyId: ID, companyContactId: ID) => ({
    endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
    method: 'DELETE',
    meta: {
      companyId,
      companyContactId,
      errorMessage: 'Sletting av bedriftskontakt feilet',
      successMessage: 'Bedriftskontakt slettet',
    },
  })
);

export const fetchSemestersForInterestform = () =>
  fetchSemesters({
    company_interest: 'True',
  });

export const fetchSemesters = createLegoApiAction()(
  'Company.FETCH_SEMESTERS',
  (_, queries: Record<string, string> = {}) => ({
    endpoint: `/company-semesters/${createQueryString(queries)}`,
    schema: [companySemesterSchema],
    meta: {
      errorMessage: 'Henting av semestre feilet',
    },
    propagateError: true,
  })
);

export const addSemester = createLegoApiAction<CompanySemester>()(
  'Company.ADD_SEMESTER',
  (_, { year, semester }: CompanySemester) => ({
    endpoint: `/company-semesters/`,
    method: 'POST',
    body: {
      year,
      semester,
      activeInterestForm: true,
    },
    meta: {
      errorMessage: 'Legge til semester feilet',
      successMessage: 'Semester lagt til!',
    },
  })
);

export const editSemester = createLegoApiAction()(
  'Company.EDIT_SEMESTER',
  (_, { id, year, semester, activeInterestForm }: CompanySemester) => ({
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
  })
);
