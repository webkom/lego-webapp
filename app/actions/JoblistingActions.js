// @flow

import { joblistingsSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Joblistings } from './ActionTypes';

export function fetchAll() {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Fetching joblistings failed'
    },
    propagateError: true
  });
}

export function fetchJoblisting(joblistingId) {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/${joblistingId}/`,
    schema: joblistingsSchema,
    meta: {
      joblistingId,
      errorMessage: 'Fetching joblisting failed'
    },
    propagateError: true
  });
}
