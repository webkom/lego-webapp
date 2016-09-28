import { Search } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function toggleSearch() {
  return {
    type: Search.TOGGLE_OPEN
  };
}

export function search(query) {
  return callAPI({
    endpoint: `/search/${query}`,
    types: Search.SEARCH,
    meta: {
      query,
      errorMessage: 'Search failed'
    }
  });
}
