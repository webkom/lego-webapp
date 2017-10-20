// @flow

import callAPI from 'app/actions/callAPI';
import type { Thunk, Action } from 'app/types';
import { Frontpage } from './ActionTypes';
import { frontpageSchema } from 'app/reducers';

export function fetch(): Thunk<Promise<?Action>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Frontpage.FETCH,
        endpoint: '/frontpage/',
        schema: frontpageSchema,
        meta: {
          errorMessage: 'Klarte ikke hente forsiden!'
        },
        propagateError: true
      })
    );
}
