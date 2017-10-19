// @flow

import { Meta } from './ActionTypes';
import callAPI from 'app/actions/callAPI';

export function fetchMeta() {
  return callAPI({
    types: Meta.FETCH,
    useCache: false,
    endpoint: '/site-meta/',
    meta: {
      errorMessage: 'Noe gikk galt med innlastingen av sida'
    },
    propagateError: true
  });
}
