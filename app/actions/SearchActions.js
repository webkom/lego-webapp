import { Search } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function search(query) {
  return callAPI({
    endpoint: `/search/${query}`,
    types: [Search.SEARCH_BEGIN, Search.SEARCH_SUCCESS, Search.SEARCH_FAILURE],
    meta: {
      query,
      errorMessage: 'Search failed'
    }
  });
}
