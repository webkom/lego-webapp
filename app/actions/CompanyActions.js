import { Company, Event } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { companySchema, eventSchema } from 'app/reducers';
import { arrayOf } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';

export function fetchAll() {
  return callAPI({
    types: Company.FETCH,
    endpoint: '/companies/',
    schema: arrayOf(companySchema),
    meta: {
      errorMessage: 'Fetching companies failed'
    }
  });
}

export function fetch(companyId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: Company.FETCH,
      endpoint: `/companies/${companyId}/`,
      schema: companySchema,
      meta: {
        errorMessage: 'Fetching single company failed'
      }
    })).then(
      dispatch(callAPI({
        types: Event.FETCH,
        endpoint: `/events/?company=${companyId}`,
        schema: arrayOf(eventSchema),
        meta: {
          errorMessage: 'Fetching assosiated events failed'
        }
      }))
    );
  };
}

export function addCompany({ name, studentContact, adminComment, active,
  description, phone, website, companyType, paymentMail }) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
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
        paymentMail
      },
      schema: companySchema,
      meta: {
        errorMessage: 'Adding company failed'
      }
    })).then(
      (callback) => {
        let company = {};
        for (const prop in callback.payload.entities.companies) {
          if (prop) {
            company = prop;
          }
        }
        dispatch(stopSubmit('company'));
        dispatch(push(`/bdb/${company}`));
      }
    );
  };
}

export function editCompany({ companyId, name, description, adminComment, website,
   phone, active, companyType, paymentMail }) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: Company.EDIT,
      endpoint: `/companies/${companyId}/`,
      method: 'PATCH',
      body: {
        name,
        description,
        adminComment,
        website,
        active,
        phone,
        companyType,
        paymentMail
      },
      schema: companySchema,
      meta: {
        errorMessage: 'Editing company failed'
      }
    })).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function addSemesterStatus({ companyId, year, semester, value, contract }, detail = false) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: Company.ADD_SEMESTER,
      endpoint: `/companies/${companyId}/semester-statuses/`,
      method: 'post',
      body: {
        year,
        semester,
        contactedStatus: value,
        contract: contract || ''
      },
      meta: {
        errorMessage: 'Adding semester status failed'
      }
    })).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`bdb/${companyId}`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function editSemesterStatus({ companyId, semesterId, value, contract }, detail = false) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: Company.EDIT_SEMESTER,
      endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
      method: 'PATCH',
      body: {
        contactedStatus: value,
        contract: contract || ''
      },
      meta: {
        errorMessage: 'Editing semester status failed'
      }
    })).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`bdb/${companyId}`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function deleteSemesterStatus(companyId, semesterId) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: Company.DELETE_SEMESTER,
      endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
      method: 'delete',
      meta: {
        companyId,
        semesterId,
        errorMessage: 'Semester status deleted. (TODO: auto-redirect)'
      },
      schema: companySchema
    })).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}
