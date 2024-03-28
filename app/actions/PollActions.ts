import { pollSchema } from '../reducers';
import { Poll } from './ActionTypes';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';
import type { Tags } from 'app/models';
import type { OptionEntity } from 'app/reducers/polls';
import type { Poll as PollType } from 'app/store/models/Poll';
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
      }),
    );
  };
}

export function fetchPoll(pollId: EntityId) {
  return callAPI<PollType>({
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
}) {
  return callAPI<PollType>({
    types: Poll.CREATE,
    endpoint: '/polls/',
    method: 'POST',
    body: data,
    schema: pollSchema,
    meta: {
      errorMessage: 'Legg til avstemning feilet',
      successMessage: 'Avstemning lagt til!',
    },
  });
}

export function editPoll(data: {
  pollId: EntityId;
  description: string;
  pinned: boolean;
  tags: Tags;
  options: Array<
    | OptionEntity
    | {
        name: string;
      }
  >;
}) {
  return callAPI<PollType>({
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

export function deletePoll(id: EntityId) {
  return callAPI({
    types: Poll.DELETE,
    endpoint: `/polls/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Fjerning av avstemning feilet!',
    },
  });
}

export function votePoll(pollId: EntityId, optionId: EntityId) {
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
