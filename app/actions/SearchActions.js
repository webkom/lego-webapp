// @flow

import callAPI from 'app/actions/callAPI';
import { Search } from './ActionTypes';
import { selectAutocomplete } from 'app/reducers/search';
import type { Thunk } from 'app/types';

export function toggleSearch() {
  return {
    type: Search.TOGGLE_OPEN
  };
}

export function autocomplete(query: string, filter?: Array<string>): Thunk<*> {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search-autocomplete/',
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
    ).then(res => selectAutocomplete(res.payload));
  };
}

export function search(query: string, types?: Array<string>): Thunk<*> {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search-search/',
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

export function mention(query: string): Thunk<*> {
  return dispatch => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search-autocomplete/',
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
