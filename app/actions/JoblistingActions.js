import { arrayOf } from 'normalizr';
import { joblistingsSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Joblistings } from './ActionTypes';

export function fetchAll() {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    schema: arrayOf(joblistingsSchema),
    meta: {
      errorMessage: 'Fetching joblistings failed'
    }
  });
}

export function fetchDetailed(joblistingId) {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/${joblistingId}/`,
    schema: joblistingsSchema,
    meta: {
      joblistingId,
      errorMessage: 'Fetching joblisting failed'
    }
  });
}
