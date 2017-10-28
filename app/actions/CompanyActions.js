// @flow

import { Company, Event, Joblistings } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import {
  companySchema,
  companySemesterSchema,
  eventSchema,
  joblistingsSchema
} from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';
import type { Thunk } from 'app/types';
import { addNotification } from 'app/actions/NotificationActions';

export const fetchAll = ({ fetchMore }: { fetchMore: boolean }): Thunk<*> => (
  dispatch,
  getState
) => {
  const endpoint = fetchMore
    ? getState().companies.pagination[''].nextPage
    : '/companies/';
  return dispatch(
    callAPI({
      types: Company.FETCH,
      endpoint,
      schema: [companySchema],
      meta: {
        errorMessage: 'Henting av bedrifter feilet',
        queryString: ''
      },
      propagateError: true
    })
  );
};

export function fetchAllAdmin() {
  return callAPI({
    types: Company.FETCH,
    endpoint: '/bdb/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Henting av bedrifter feilet'
    },
    propagateError: true
  });
}

export function fetch(companyId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Company.FETCH,
        endpoint: `/companies/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Henting av en bedrift feilet'
        },
        propagateError: true
      })
    );
}

export function fetchAdmin(companyId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Company.FETCH,
        endpoint: `/bdb/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Henting av en bedrift feilet'
        },
        propagateError: true
      })
    );
}

export function fetchEventsForCompany(companyId: string) {
  return (dispatch: Dispatch) =>
    dispatch(
      callAPI({
        types: Event.FETCH,
        endpoint: `/events/?company=${companyId}`,
        schema: [eventSchema],
        meta: {
          errorMessage: 'Henting av tilknyttede arrangementer feilet'
        }
      })
    );
}

export function fetchJoblistingsForCompany(companyId: string) {
  return (dispatch: Dispatch) =>
    dispatch(
      callAPI({
        types: Joblistings.FETCH,
        endpoint: `/joblistings/?company=${companyId}`,
        schema: [joblistingsSchema],
        meta: {
          errorMessage: 'Henting av tilknyttede jobbannonser feilet'
        }
      })
    );
}

export function addCompany(data: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));
    return dispatch(
      callAPI({
        types: Company.ADD,
        endpoint: '/bdb/',
        method: 'POST',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Legg til bedrift feilet'
        }
      })
    )
      .then(action => {
        if (!action || !action.payload) return;
        const id = action.payload.result;
        dispatch(stopSubmit('company'));
        dispatch(addNotification({ message: 'Bedrift lagt til.' }));
        dispatch(push(`/bdb/${id}`));
      })
      .catch();
  };
}

export function editCompany({ companyId, ...data }: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.EDIT,
        endpoint: `/bdb/${companyId}/`,
        method: 'PATCH',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Endring av bedrift feilet'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(addNotification({ message: 'Bedrift endret.' }));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function deleteCompany(companyId: number): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.DELETE,
        endpoint: `/bdb/${companyId}/`,
        method: 'DELETE',
        meta: {
          id: Number(companyId),
          errorMessage: 'Sletting av bedrift feilet'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Bedrift slettet.' }));
      dispatch(push('/bdb/'));
    });
  };
}

export function addSemesterStatus(
  { companyId, ...data }: Object,
  options: Object = { detail: false }
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.ADD_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/`,
        method: 'POST',
        body: data,
        meta: {
          errorMessage: 'Legg til semesterstatus feilet',
          companyId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Semester status lagt til.' }));
      if (options.detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function editSemesterStatus(
  { companyId, semesterStatusId, ...data }: Object,
  options: Object = { detail: false }
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.EDIT_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
        method: 'PATCH',
        body: data,
        meta: {
          errorMessage: 'Endring av semester status feilet',
          companyId,
          semesterStatusId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Semesterstatus endret.' }));
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
  semesterId: number
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.DELETE_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
        method: 'DELETE',
        meta: {
          companyId,
          semesterId,
          errorMessage: 'Sletting av semesterstatus feilet'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Semester Status slettet' }));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function fetchCompanyContacts({ companyId }: { companyId: number }) {
  return callAPI({
    types: Company.FETCH_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av bedriftskontakt feilet'
    }
  });
}

export function addCompanyContact({
  companyId,
  name,
  role,
  mail,
  phone
}: Object): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.ADD_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/`,
        method: 'POST',
        body: {
          name,
          role,
          mail,
          phone
        },
        meta: {
          errorMessage: 'Legg til bedriftskontakt feilet',
          companyId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Bedriftskontakt lagt til.' }));
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
  phone
}: Object): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.EDIT_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
        method: 'PATCH',
        body: {
          name,
          role,
          mail,
          phone
        },
        meta: {
          errorMessage: 'Endring av bedriftskontakt feilet',
          companyId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Bedriftskontakt endret.' }));
      dispatch(push(`/bdb/${companyId}`));
    });
  };
}

export function deleteCompanyContact(
  companyId: number,
  companyContactId: number
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.DELETE_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
        method: 'DELETE',
        meta: {
          companyId,
          companyContactId,
          errorMessage: 'Sletting av bedriftskontakt feilet'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Bedriftskontakt slettet.' }));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function fetchSemesters({ companyInterest }: Object = {}) {
  return callAPI({
    types: Company.FETCH_SEMESTERS,
    endpoint: `/company-semesters/${createQueryString({
      company_interest: companyInterest
    })}`,
    schema: [companySemesterSchema],
    meta: {
      errorMessage: 'Henting av semestre feilet'
    },
    propagateError: true
  });
}

type SemesterInput = {
  year: number,
  semester: number
};

export function addSemester({ year, semester }: SemesterInput): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Company.ADD_SEMESTER,
        endpoint: `/company-semesters/`,
        method: 'POST',
        body: {
          year,
          semester
        },
        meta: {
          errorMessage: 'Legge til semester feilet'
        }
      })
    );
  };
}
