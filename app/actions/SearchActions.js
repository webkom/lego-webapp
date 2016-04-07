import { Search } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function search(query) {
  return callAPI({
    endpoint: '/search/',
    type: Search.SEARCH,
    meta: {
      query
    }
  });
}
