// @flow

import callAPI from './callAPI';
import { Poll } from './ActionTypes';
import { pollSchema } from '../reducers';
import type { PollEntity } from '../reducers/polls';
import { addToast } from './ToastActions';

export function fetchAll() {
  return callAPI({
    types: Poll.FETCH_ALL,
    endpoint: '/polls/',
    schema: [pollSchema],
    meta: {
      errorMessage: 'Henting av avstemninger feilet'
    }
  });
}

export function fetchPoll(pollId: number) {
  return callAPI({
    types: Poll.FETCH,
    endpoint: `/polls/${pollId}`,
    schema: pollSchema,
    meta: {
      errorMessage: 'Henting av avstemning feilet'
    }
  });
}

export function createPoll(data: PollEntity) {
    return callAPI({
        types: Poll.CREATE,
        endpoint: '/polls/',
        method: 'POST',
        schema: pollSchema,
        body: data,
        meta: {
          errorMessage: 'Oppretting av avstemning feilet'
        }
      })
    .then(() =>
      addToast({ message: 'Avstemning opprettet!' })
    );
}

export function deleteCompanyInterest(pollId: number) {
      return callAPI({
        types: Poll.DELETE,
        endpoint: `/polls/${pollId}/`,
        method: 'DELETE',
        meta: {
          pollId,
          errorMessage: 'Fjerning av avstemning feilet!'
        }
      })
    .then(() => addToast({ message: 'Avstemning fjernet!' }));
}
