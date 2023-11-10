import callAPI from 'app/actions/callAPI';
import { selectAutocomplete } from 'app/reducers/search';
import { Search } from './ActionTypes';
import type { Action, Thunk } from 'app/types';

export function toggleSearch(): Action {
  return {
    type: Search.TOGGLE_OPEN,
  };
}
export function autocomplete(
  query: string,
  filter?: Array<string>,
): Thunk<Promise<Array<any>>> {
  return (dispatch) => {
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
