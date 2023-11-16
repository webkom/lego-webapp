import { push } from 'redux-first-history';
import { startSubmit, stopSubmit } from 'redux-form';
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
import type { Thunk } from 'app/types';

export const fetchAll = ({ fetchMore }: { fetchMore: boolean }): Thunk<any> => {
  return callAPI({
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
export function fetchAllAdmin(): Thunk<any> {
  return callAPI({
    types: Company.FETCH,
    endpoint: '/bdb/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Henting av bedrifter feilet',
    },
    propagateError: true,
  });
}
export function fetch(companyId: number): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
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
export function fetchAdmin(companyId: number): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Company.FETCH,
        endpoint: `/bdb/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Henting av en bedrift feilet',
        },
        propagateError: true,
      })
    );
}
export const fetchEventsForCompany =
  ({
    queryString,
    loadNextPage = false,
  }: {
    queryString: string;
    loadNextPage: boolean;
  }): Thunk<any> =>
  (dispatch, getState) => {
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
export function fetchJoblistingsForCompany(companyId: string): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Joblistings.FETCH,
        endpoint: `/joblistings/?company=${companyId}`,
        schema: [joblistingsSchema],
        meta: {
          errorMessage: 'Henting av tilknyttede jobbannonser feilet',
        },
      })
    );
}
export function addCompany(data: Record<string, any>): Thunk<any> {
  return (dispatch) => {
    dispatch(startSubmit('company'));
    return dispatch(
      callAPI({
        types: Company.ADD,
        endpoint: '/bdb/',
        method: 'POST',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Legg til bedrift feilet',
        },
      })
    )
      .then((action) => {
        if (!action || !action.payload) return;
        const id = action.payload.result;
        dispatch(stopSubmit('company'));
        dispatch(
          addToast({
            message: 'Bedrift lagt til.',
          })
        );
        dispatch(push(`/bdb/${id}`));
      })
      .catch();
  };
}
export function editCompany({
  companyId,
  ...data
}: Record<string, any>): Thunk<any> {
  return (dispatch) => {
    dispatch(startSubmit('company'));
    return dispatch(
      callAPI({
        types: Company.EDIT,
        endpoint: `/bdb/${companyId}/`,
        method: 'PATCH',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Endring av bedrift feilet',
        },
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(
        addToast({
          message: 'Bedrift endret.',
        })
      );
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}
export function deleteCompany(companyId: number): Thunk<any> {
  return (dispatch) => {
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
  options: Record<string, any> = {
    detail: false,
  }
): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
  options: Record<string, any> = {
    detail: false,
  }
): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
export function deleteSemesterStatus(
  companyId: number,
  semesterStatusId: number
): Thunk<any> {
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
export function fetchCompanyContacts({
  companyId,
}: {
  companyId: number;
}): Thunk<any> {
  return callAPI({
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
}: Record<string, any>): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
}: Record<string, any>): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
export function deleteCompanyContact(
  companyId: number,
  companyContactId: number
): Thunk<any> {
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
export function fetchSemestersForInterestform(): Thunk<any> {
  return fetchSemesters({
    company_interest: 'True',
  });
}
export function fetchSemesters(
  queries: Record<
    string,
    (string | null | undefined) | (number | null | undefined)
  > = {}
): Thunk<any> {
  return callAPI({
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
}: CompanySemesterEntity): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
      })
    );
  };
}
export function editSemester({
  id,
  year,
  semester,
  activeInterestForm,
}: {
  id: number;
  year: string;
  semester: string;
  activeInterestForm: boolean;
}): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
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
      })
    );
  };
}
