// @flow

import callAPI from 'app/actions/callAPI';
import type { Thunk } from 'app/types';
import { Meta } from './ActionTypes';

export function fetchMeta(): Thunk<*> {
  return callAPI({
    types: Meta.FETCH,
    useCache: false,
    endpoint: '/site-meta/',
    meta: {
      errorMessage: 'Noe gikk galt med innlastingen av sida',
    },
    propagateError: true,
  });
}
