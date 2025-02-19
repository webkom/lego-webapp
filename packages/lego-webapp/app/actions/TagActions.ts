import callAPI from 'app/actions/callAPI';
import { tagSchema } from 'app/reducers';
import { Tag } from './ActionTypes';

export function fetch(id: string | 'popular') {
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
export function fetchPopular() {
  return callAPI({
    types: Tag.FETCH,
    endpoint: `/tags/popular/`,
    schema: [tagSchema],
    pagination: {
      fetchNext: false,
    },
    meta: {
      errorMessage: 'Henting av populære tags feilet',
    },
    propagateError: false,
  });
}
export function fetchAll() {
  return callAPI({
    types: Tag.FETCH,
    endpoint: '/tags/',
    schema: [tagSchema],
    meta: {
      errorMessage: 'Henting av tags feilet',
    },
    propagateError: true,
  });
}
