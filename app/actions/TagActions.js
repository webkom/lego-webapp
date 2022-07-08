// @flow
import callAPI from 'app/actions/callAPI';
import { tagSchema } from 'app/reducers';
import type { Thunk } from 'app/types';
import { Tag } from './ActionTypes';

export function fetch(id: string): Thunk<*> {
  return callAPI({
    types: Tag.FETCH,
    endpoint: `/tags/${id}/`,
    schema: tagSchema,
    meta: {
      errorMessage: 'Henting av tag feilet',
    },
    propagateError: true,
  });
}

export function fetchPopular(): Thunk<*> {
  return callAPI({
    types: Tag.POPULAR,
    endpoint: `/tags/popular/`,
    meta: {
      errorMessage: 'Henting av populære tags feilet',
    },
    propagateError: false,
  });
}

export function fetchAll({ next = false }: { next: boolean } = {}): Thunk<*> {
  return callAPI({
    types: Tag.FETCH,
    endpoint: '/tags/',
    schema: [tagSchema],
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av tags feilet',
    },
    propagateError: true,
  });
}
