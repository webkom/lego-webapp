import callAPI from 'app/actions/callAPI';
import { Meta } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchMeta(): Thunk<any> {
  return callAPI({
    types: Meta.FETCH,
    endpoint: '/site-meta/',
    meta: {
      errorMessage: 'Noe gikk galt med innlastingen av sida',
    },
    propagateError: true,
  });
}
