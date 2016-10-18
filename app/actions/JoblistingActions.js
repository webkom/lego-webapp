import { arrayOf } from 'normalizr';
import { joblistingsSchema } from 'app/reducers';
import  callAPI from 'app/actions/callAPI';
import { Joblistings } from './ActionTypes';

export function fetchAll() {
  return callAPI({
    types: [
      Joblistings.FETCH_BEGIN,
      Joblistings.FETCH_SUCCESS,
      Joblistings.FETCH_FAILURE
    ],
    endpoint: '/joblistings/',
    schema: arrayOf(joblistingsSchema),
    meta: {
      errorMessage: `Fetching joblistings failed`
    }
  });
}
