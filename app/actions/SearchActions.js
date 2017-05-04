// @flow

import callAPI from 'app/actions/callAPI';
import { Search } from './ActionTypes';

export function toggleSearch() {
  return {
    type: Search.TOGGLE_OPEN
  };
}

export function autocomplete(query, filter) {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search/autocomplete/',
        types: Search.AUTOCOMPLETE,
        method: 'post',
        body: {
          query,
          types: filter
        },
        meta: {
          query,
          errorMessage: 'Autocomplete failed'
        }
      })
    );
  };
}

export function search(query, types) {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search/search/',
        types: Search.SEARCH,
        method: 'post',
        body: {
          query,
          types
        },
        meta: {
          query,
          errorMessage: 'Search failed'
        }
      })
    );
  };
}

export function mention(query) {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search/autocomplete/',
        types: Search.MENTION,
        method: 'post',
        body: {
          query,
          contentType: 'users.user'
        },
        meta: {
          query,
          errorMessage: 'Search failed'
        }
      })
    );
  };
}
