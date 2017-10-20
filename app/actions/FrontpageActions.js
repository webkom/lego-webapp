// @flow

import callAPI from 'app/actions/callAPI';
import { Frontpage } from './ActionTypes';
import { frontpageSchema } from 'app/reducers';

export function fetch() {
  return callAPI({
    types: Frontpage.FETCH,
    endpoint: '/frontpage/',
    schema: frontpageSchema,
    meta: {
      errorMessage: 'Klarte ikke hente forsiden!'
    },
    propagateError: true
  });
}
