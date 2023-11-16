import { push } from 'redux-first-history';
import { pollSchema } from '../reducers';
import { Poll } from './ActionTypes';
import callAPI from './callAPI';
import type { Tags } from 'app/models';
import type { OptionEntity } from 'app/reducers/polls';
import type { Thunk } from 'app/types';

export function fetchAll({
  next = false,
}: {
  next?: boolean;
} = {}): Thunk<any> {
  return (dispatch, getState) => {
    const cursor = next ? getState().polls.pagination.next : {};
    return dispatch(
      callAPI({
        types: Poll.FETCH_ALL,
        endpoint: '/polls/',
        schema: [pollSchema],
        query: cursor,
        meta: {
          errorMessage: 'Henting av avstemninger feilet',
        },
      })
    );
  };
}
export function fetchPoll(pollId: number): Thunk<any> {
  return callAPI({
    types: Poll.FETCH,
    endpoint: `/polls/${pollId}/`,
    schema: pollSchema,
    meta: {
      errorMessage: 'Henting av avstemning feilet',
    },
    propagateError: true,
  });
}
export function createPoll(data: {
  description: string;
  pinned: boolean;
  tags: Tags;
  options: Array<{
    name: string;
  }>;
}): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Poll.CREATE,
        endpoint: '/polls/',
        method: 'POST',
        body: data,
        schema: pollSchema,
        meta: {
          errorMessage: 'Legg til avstemning feilet',
          successMessage: 'Avstemning lagt til!',
        },
      })
    ).then(() => dispatch(push(`/polls/`)));
}
export function editPoll(data: {
  pollId: number;
  description: string;
  pinned: boolean;
  tags: Tags;
  options: Array<
    | OptionEntity
    | {
        name: string;
      }
  >;
}): Thunk<any> {
  return callAPI({
    types: Poll.UPDATE,
    endpoint: `/polls/${data.pollId}/`,
    method: 'PATCH',
    body: data,
    schema: pollSchema,
    meta: {
      errorMessage: 'Endring av avstemning feilet',
      successMessage: 'Avstemning endret',
    },
  });
}
export function deletePoll(id: number): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Poll.DELETE,
        endpoint: `/polls/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Fjerning av avstemning feilet!',
        },
      })
    ).then(() => dispatch(push(`/polls/`)));
}
export function votePoll(pollId: number, optionId: number): Thunk<any> {
  return callAPI({
    types: Poll.UPDATE,
    endpoint: `/polls/${pollId}/vote/`,
    method: 'POST',
    schema: pollSchema,
    body: {
      optionId,
    },
    meta: {
      pollId,
      optionId,
      errorMessage: 'Avstemning feilet!',
      successMessage: 'Avstemning registrert!',
    },
  });
}
