import { Company } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { companySchema } from 'app/reducers';
import { arrayOf } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';

export function fetchAll() {
  return callAPI({
    types: [
      Company.FETCH_BEGIN,
      Company.FETCH_SUCCESS,
      Company.FETCH_FAILURE
    ],
    endpoint: '/companies/',
    schema: arrayOf(companySchema),
    meta: {
      errorMessage: 'Fetching companies failed'
    }
  });
}

export function fetch(companyId) {
  return callAPI({
    types: [
      Company.FETCH_BEGIN,
      Company.FETCH_SUCCESS,
      Company.FETCH_FAILURE
    ],
    endpoint: `/companies/${companyId}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Fetching single company failed'
    }
  });
}

export function addCompany({ name, studentContact, adminComment, jobOfferOnly, phone }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.ADD_BEGIN,
        Company.ADD_SUCCESS,
        Company.ADD_FAILURE
      ],
      endpoint: '/companies/',
      method: 'post',
      body: {
        name,
        studentContact,
        adminComment,
        jobOfferOnly,
        phone
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

export function editCompany({ companyId, name, studentContact, adminComment,
  jobOfferOnly, phone }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.EDIT_BEGIN,
        Company.EDIT_SUCCESS,
        Company.EDIT_FAILURE
      ],
      endpoint: `/companies/${companyId}/`,
      method: 'patch',
      body: {
        name,
        studentContact,
        adminComment,
        jobOfferOnly,
        phone
      },
      schema: companySchema,
      meta: {
        errorMessage: 'Editing company failed'
      }
    })).then(
      (callback) => {
        dispatch(stopSubmit('company'));
        dispatch(push(`/bdb/${companyId}/`));
      }
    );
  };
}

export function addSemesterStatus({ companyId, semesterId, value, year, semester }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.ADD_SEMESTER_BEGIN,
        Company.ADD_SEMESTER_SUCCESS,
        Company.ADD_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semesterStatuses/`,
      method: 'post',
      body: {
        year,
        semester,
        contactedStatus: value
      },
      meta: {
        errorMessage: 'Adding semester status failed'
      }
    }));
  };
}

export function editSemesterStatus({ companyId, semesterId, value }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.EDIT_SEMESTER_BEGIN,
        Company.EDIT_SEMESTER_SUCCESS,
        Company.EDIT_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semesterStatuses/${semesterId}/`,
      method: 'PATCH',
      body: {
        contactedStatus: value
      },
      meta: {
        errorMessage: 'Editing semester status failed'
      }
    })).then(
      (callback) => {
        dispatch(stopSubmit('company'));
        dispatch(push('/bdb/'));
      }
    );
  };
}

export function deleteSemesterStatus(companyId, semesterId) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.DELETE_SEMESTER_BEGIN,
        Company.DELETE_SEMESTER_SUCCESS,
        Company.DELETE_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semesterStatuses/${semesterId}/`,
      method: 'delete',
      meta: {
        companyId,
        semesterId
      },
      schema: companySchema
    })).then(
      (callback) => {
        dispatch(stopSubmit('company'));
        dispatch(push(`/bdb/${companyId}/`));
      }
    );
  };
}
