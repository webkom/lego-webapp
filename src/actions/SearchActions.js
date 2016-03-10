import { Search } from './ActionTypes';
import { callAPI } from '🏠/utils/http';

export function search(query) {
  return callAPI({
    endpoint: '/search/',
    type: Search.SEARCH,
    meta: {
      query
    }
  });
}
