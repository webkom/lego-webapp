import { createAction } from '@reduxjs/toolkit';
import { Search } from '~/redux/actionTypes';
import callAPI, { APIPromiseResult, APIPromiseResultStrict, NullableAPIPromiseResultStrict } from '~/redux/actions/callAPI';
import { RawSearchResult, SearchResult, transformAutocompletes } from '~/redux/slices/search';
import type { Thunk } from 'app/types';
import type { AppDispatch } from '~/redux/createStore';

export const toggleSearch = createAction(Search.TOGGLE_OPEN);

export function autocomplete(query: string, filter?: Array<string>): NullableAPIPromiseResultStrict<SearchResult[]> {
  return (dispatch: AppDispatch) => {
    if (!query) {
      return null;
    }

    return dispatch(
      callAPI<RawSearchResult[]>({
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
      (action && {
        ...action,
        payload: transformAutocompletes(action.payload),
      })
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
