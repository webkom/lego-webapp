import { Tag } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { tagSchema } from '~/redux/schemas';

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
