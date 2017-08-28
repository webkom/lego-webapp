// @flow

import { Company, Event } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { companySchema, eventSchema } from 'app/reducers';
import isRequestNeeded from 'app/utils/isRequestNeeded';

import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';

const reducerKey = 'companies';

export function fetchAll() {
  return callAPI({
    types: Company.FETCH,
    endpoint: '/companies/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Fetching companies failed'
    },
    isRequestNeeded: state => isRequestNeeded(state, reducerKey)
  });
}

export function fetch(companyId) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Company.FETCH,
        endpoint: `/companies/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Fetching single company failed'
        },
        isRequestNeeded: state => isRequestNeeded(state, reducerKey, companyId)
      })
    ).then(() =>
      dispatch(
        callAPI({
          types: Event.FETCH,
          endpoint: `/events/?company=${companyId}`,
          schema: [eventSchema],
          meta: {
            errorMessage: 'Fetching assosiated events failed'
          }
        })
      )
    );
  };
}

export function addCompany({
  name,
  studentContact,
  adminComment,
  active,
  description,
  phone,
  website,
  companyType,
  paymentMail,
  address
}) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.ADD,
        endpoint: '/companies/',
        method: 'post',
        body: {
          name,
          studentContact,
          adminComment,
          active,
          description,
          phone,
          website,
          companyType,
          paymentMail,
          address
        },
        schema: companySchema,
        meta: {
          errorMessage: 'Adding company failed'
        }
      })
    )
      .then(action => {
        const id = action.payload.result;
        dispatch(stopSubmit('company'));
        dispatch(push(`/bdb/${id}`));
      })
      .catch();
  };
}

export function editCompany({
  companyId,
  name,
  description,
  adminComment,
  website,
  studentContact,
  phone,
  active,
  companyType,
  paymentMail,
  address
}) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.EDIT,
        endpoint: `/companies/${companyId}/`,
        method: 'PATCH',
        body: {
          name,
          description,
          adminComment,
          website,
          studentContact,
          active,
          phone,
          companyType,
          paymentMail,
          address
        },
        schema: companySchema,
        meta: {
          errorMessage: 'Editing company failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function deleteCompany(companyId) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.DELETE,
        endpoint: `/companies/${companyId}/`,
        method: 'delete',
        meta: {
          companyId,
          errorMessage: 'Deleting company failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push('/bdb/'));
    });
  };
}

export function addSemesterStatus(
  { companyId, year, semester, contactedStatus, contract },
  detail = false
) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.ADD_SEMESTER,
        endpoint: `/companies/${companyId}/semester-statuses/`,
        method: 'post',
        body: {
          year,
          semester,
          contactedStatus,
          contract
        },
        meta: {
          errorMessage: 'Adding semester status failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function editSemesterStatus(
  { companyId, semesterId, contactedStatus, contract },
  detail = false
) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.EDIT_SEMESTER,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
        method: 'PATCH',
        body: {
          contactedStatus,
          contract
        },
        meta: {
          errorMessage: 'Editing semester status failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function deleteSemesterStatus(companyId, semesterId) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.DELETE_SEMESTER,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
        method: 'delete',
        meta: {
          companyId,
          semesterId,
          errorMessage: 'Deleting semester status failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function addCompanyContact({ companyId, name, role, mail, phone }) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.ADD_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/`,
        method: 'post',
        body: {
          name,
          role,
          mail,
          phone
        },
        meta: {
          errorMessage: 'Adding company contact failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
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
}) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
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
          errorMessage: 'Editing company contact failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`bdb/${companyId}`));
    });
  };
}

export function deleteCompanyContact(companyId, companyContactId) {
  return dispatch => {
    dispatch(startSubmit('company'));

    dispatch(
      callAPI({
        types: Company.DELETE_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
        method: 'delete',
        meta: {
          companyId,
          companyContactId,
          errorMessage: 'Deleting company contact failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}
