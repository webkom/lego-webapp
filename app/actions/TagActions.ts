import callAPI from 'app/actions/callAPI';
import { tagSchema } from 'app/reducers';
import { Tag } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetch(id: string): Thunk<any> {
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
export function fetchPopular(): Thunk<any> {
  return callAPI({
    types: Tag.POPULAR,
    endpoint: `/tags/popular/`,
    meta: {
      errorMessage: 'Henting av populære tags feilet',
    },
    propagateError: false,
  });
}
export function fetchAll({
  next = false,
}: {
  next?: boolean;
} = {}): Thunk<any> {
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
