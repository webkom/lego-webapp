import { Meta } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import type { Thunk } from 'app/types';
export function fetchMeta(): Thunk<any> {
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
