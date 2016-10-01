import { Search } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function toggleSearch() {
  return {
    type: Search.TOGGLE_OPEN
  };
}

export function search(query) {
  return (dispatch, getState) => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(callAPI({
      endpoint: '/search/search/',
      types: Search.SEARCH,
      method: 'post',
      body: {
        query
      },
      meta: {
        query,
        errorMessage: 'Search failed'
      }
    }));
  };
}
