import { push } from 'redux-first-history';
import { addToast } from 'app/actions/ToastActions';
import callAPI from 'app/actions/callAPI';
import {
  companySchema,
  companySemesterSchema,
  eventSchema,
  joblistingsSchema,
} from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { semesterToText } from '../routes/companyInterest/utils';
import { Company, Event, Joblistings } from './ActionTypes';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type {
  AdminListCompany,
  CompanyContact,
  DetailedCompany,
  DetailedSemesterStatus,
  ListCompany,
} from 'app/store/models/Company';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import type { GetState } from 'app/types';

export const fetchAll = ({ fetchMore }: { fetchMore: boolean }) => {
  return callAPI<ListCompany[]>({
    types: Company.FETCH,
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
  });
};

export function fetchAllAdmin() {
  return callAPI<AdminListCompany[]>({
    types: Company.FETCH,
    endpoint: '/bdb/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
    },
    propagateError: true,
  });
}

export function fetch(companyId: ID) {
  return (dispatch: AppDispatch) =>
    dispatch(
      callAPI<DetailedCompany>({
        types: Company.FETCH,
        endpoint: `/companies/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Henting av en bedrift feilet',
        },
        propagateError: true,
      })
    );
}

export function fetchAdmin(companyId: ID) {
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

export const fetchEventsForCompany =
  ({
    queryString,
    loadNextPage = false,
  }: {
    queryString: string;
    loadNextPage: boolean;
  }) =>
  (dispatch: AppDispatch, getState: GetState) => {
    const endpoint = loadNextPage
      ? getState().events.pagination[queryString].nextPage
      : `/events/${queryString}`;

    return dispatch(
      callAPI({
        types: Event.FETCH,
        endpoint,
        schema: [eventSchema],
        meta: {
          queryString,
          errorMessage: 'Henting av tilknyttede arrangementer feilet',
        },
      })
    );
  };

export function fetchJoblistingsForCompany(companyId: ID) {
  return callAPI<ListJoblisting[]>({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/?company=${companyId}`,
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Henting av tilknyttede jobbannonser feilet',
    },
  });
}

export function addCompany(data: Record<string, any>) {
  return callAPI<DetailedCompany>({
    types: Company.ADD,
    endpoint: '/bdb/',
    method: 'POST',
    body: data,
    schema: companySchema,
    meta: {
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
      errorMessage: 'Endring av bedrift feilet',
    },
  });
}

export function deleteCompany(companyId: ID) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI({
        types: Company.DELETE,
        endpoint: `/bdb/${companyId}/`,
        method: 'DELETE',
        meta: {
          id: Number(companyId),
          errorMessage: 'Sletting av bedrift feilet',
        },
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Bedrift slettet.',
        })
      );
      dispatch(push('/bdb/'));
    });
  };
}

export function addSemesterStatus(
  { companyId, ...data }: Record<string, any>,
  options: { detail: boolean } = {
    detail: false,
  }
) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<DetailedSemesterStatus>({
        types: Company.ADD_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/`,
        method: 'POST',
        body: data,
        meta: {
          errorMessage: 'Legg til semesterstatus feilet',
          companyId,
        },
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Semester status lagt til.',
        })
      );

      if (options.detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function editSemesterStatus(
  { companyId, semesterStatusId, ...data }: Record<string, any>,
  options: { detail: boolean } = {
    detail: false,
  }
) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<DetailedSemesterStatus>({
        types: Company.EDIT_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
        method: 'PATCH',
        body: data,
        meta: {
          errorMessage: 'Endring av semester status feilet',
          companyId,
          semesterStatusId,
        },
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Semesterstatus endret.',
        })
      );

      if (options.detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function deleteSemesterStatus(companyId: ID, semesterStatusId: ID) {
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

export function fetchCompanyContacts({ companyId }: { companyId: ID }) {
  return callAPI<CompanyContact[]>({
    types: Company.FETCH_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av bedriftskontakt feilet',
    },
  });
}

export function addCompanyContact({
  companyId,
  name,
  role,
  mail,
  phone,
}: Record<string, any>) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<CompanyContact>({
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
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Bedriftskontakt lagt til.',
        })
      );
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function editCompanyContact({
  companyId,
  companyContactId,
  name,
  role,
  mail,
  phone,
}: Record<string, any>) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<CompanyContact>({
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
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Bedriftskontakt endret.',
        })
      );
      dispatch(push(`/bdb/${companyId}`));
    });
  };
}

export function deleteCompanyContact(companyId: ID, companyContactId: ID) {
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

export function fetchSemesters(
  queries: Record<
    string,
    (string | null | undefined) | (number | null | undefined)
  > = {}
) {
  return callAPI<DetailedSemesterStatus[]>({
    types: Company.FETCH_SEMESTERS,
    endpoint: `/company-semesters/${createQueryString(queries)}`,
    schema: [companySemesterSchema],
    meta: {
      errorMessage: 'Henting av semestre feilet',
    },
    propagateError: true,
  });
}

export function addSemester({ year, semester }: CompanySemesterEntity) {
  return callAPI<DetailedSemesterStatus>({
    types: Company.ADD_SEMESTER,
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
  });
}

export function editSemester({
  id,
  year,
  semester,
  activeInterestForm,
}: {
  id: ID;
  year: string;
  semester: string;
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
