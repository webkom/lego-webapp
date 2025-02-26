import { createAction } from '@reduxjs/toolkit';
import { Search } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { selectAutocomplete } from '~/redux/slices/search';
import type { Thunk } from 'app/types';
import type { AppDispatch } from '~/redux/createStore';

export const toggleSearch = createAction(Search.TOGGLE_OPEN);

export function autocomplete(query: string, filter?: Array<string>) {
  return (dispatch: AppDispatch) => {
    if (!query) {
      return Promise.resolve([]);
    }

    return dispatch(
      callAPI({
        endpoint: '/search-autocomplete/',
        types: Search.AUTOCOMPLETE,
        method: 'POST',
        body: {
          query,
          types: filter,
        },
        meta: {
          query,
          errorMessage: 'Autofyll feilet',
        },
      }),
    ).then((action) =>
      selectAutocomplete(action ? (action as any).payload : []),
    );
  };
}
export function search(query: string, types?: Array<string>): Thunk<any> {
  return (dispatch) => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search-search/',
        types: Search.SEARCH,
        method: 'POST',
        body: {
          query,
          types,
        },
        meta: {
          query,
          errorMessage: 'Søk feilet',
        },
      }),
    );
  };
}
export function mention(query: string): Thunk<any> {
  return (dispatch) => {
    if (!query) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        endpoint: '/search-autocomplete/',
        types: Search.MENTION,
        method: 'POST',
        body: {
          query,
          contentType: 'users.user',
        },
        meta: {
          query,
          errorMessage: 'Omtale feilet',
        },
      }),
    );
  };
}
