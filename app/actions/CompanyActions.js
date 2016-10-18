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

export function addCompany({ name, studentContact, adminComment, active,
  jobOfferOnly, bedex, description, phone, website }) {
  return (dispatch) => {
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
        active,
        jobOfferOnly,
        bedex,
        description,
        phone,
        website
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

export function editCompany({ companyId, name, studentContact, adminComment, active,
  jobOfferOnly, bedex, description, phone, website }) {
  console.log('Yo');
  console.log({ companyId, name, studentContact, adminComment, active,
    jobOfferOnly, bedex, description, phone, website });
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.EDIT_BEGIN,
        Company.EDIT_SUCCESS,
        Company.EDIT_FAILURE
      ],
      endpoint: `/companies/${companyId}/`,
      method: 'PATCH',
      body: {
        name,
        studentContact,
        adminComment,
        active,
        jobOfferOnly,
        bedex,
        description,
        phone,
        website
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

export function addSemesterStatus({ companyId, value, year, semester }) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.ADD_SEMESTER_BEGIN,
        Company.ADD_SEMESTER_SUCCESS,
        Company.ADD_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semester-statuses/`,
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

export function editSemesterStatus({ companyId, semesterId, value, contract }) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.EDIT_SEMESTER_BEGIN,
        Company.EDIT_SEMESTER_SUCCESS,
        Company.EDIT_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
      method: 'PATCH',
      body: {
        contactedStatus: value,
        contract
      },
      meta: {
        errorMessage: 'Editing semester status failed'
      }
    })).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push('/bdb/'));
    });
  };
}

export function deleteSemesterStatus(companyId, semesterId) {
  return (dispatch) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Company.DELETE_SEMESTER_BEGIN,
        Company.DELETE_SEMESTER_SUCCESS,
        Company.DELETE_SEMESTER_FAILURE
      ],
      endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
      method: 'delete',
      meta: {
        companyId,
        semesterId
      },
      schema: companySchema
    })).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}
