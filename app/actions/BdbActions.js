import { Bdb } from './ActionTypes';
import { callAPI } from '../utils/http';
import { companySchema } from 'app/reducers';
import { arrayOf } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';

export function fetchAll() {
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: '/companies/',
    schema: arrayOf(companySchema)
  });
}

export function fetch(companyId) {
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: `/companies/${companyId}/`,
    schema: companySchema
  });
}

export function addCompany({ name, studentContact, adminComment, jobOfferOnly, phone }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('company'));

    dispatch(callAPI({
      types: [
        Bdb.ADD_BEGIN,
        Bdb.ADD_SUCCESS,
        Bdb.ADD_FAILURE
      ],
      endpoint: '/companies/',
      method: 'post',
      body: {
        id: Date.now(),
        name,
        studentContact,
        adminComment,
        jobOfferOnly,
        phone
      },
      schema: companySchema
    })).then(
      (payload) => {
        dispatch(stopSubmit('company'));
        dispatch(push(`/companies/${payload.id}`));
      },
      (error) => {
        const errors = { ...error.response.body };
        if (errors.text) {
          errors.text = errors.text[0];
        }
        dispatch(stopSubmit('company', errors));
      }
    );
  };
}
