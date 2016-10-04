import { Bdb } from './ActionTypes';
import { callAPI } from '../utils/http';
import { companySchema } from 'app/reducers';
import { arrayOf } from 'normalizr';

export function fetchAll() {
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: '/companies/',
    schema: arrayOf(companySchema),
    meta: {
      errorMessage: 'Fetching companies failed'
    }
  });
}

export function fetchCompany(companyId) {
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: `/companies/${companyId}/`,
    schema: companySchema,
    meta: {
      errorMessage: 'Fetching company failed'
    }
  });
}
