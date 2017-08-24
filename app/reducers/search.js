// @flow

import { createSelector } from 'reselect';
import { Search } from '../actions/ActionTypes';
import type { Action } from 'app/types';

const initialState = {
  results: [],
  autocomplete: [],
  query: '',
  searching: false,
  open: false
};

const searchMapping = {
  'users.user': {
    label: 'fullName',
    color: '#A1C34A',
    path: '/users/',
    value: 'id',
    link: user => `/users/${user.username}`,
    profilePicture: 'profilePicture'
  },
  'articles.article': {
    icon: 'newspaper-o',
    label: 'title',
    picture: 'cover',
    color: '#52B0EC',
    path: '/articles/',
    value: 'id',
    content: 'text'
  },
  'events.event': {
    label: 'title',
    icon: 'calendar',
    color: '#E8953A',
    picture: 'cover',
    path: '/events/',
    value: 'id',
    content: 'description'
  },
  'flatpages.page': {
    label: 'title',
    profilePicture: 'picture',
    color: '#E8953A',
    path: '/pages/',
    value: 'slug',
    content: 'content'
  },
  'companies.company': {
    icon: 'file-text',
    label: 'name',
    color: '#E8953A',
    path: '/company/',
    value: 'id',
    content: 'content'
  },
  'users.abakusgroup': {
    label: 'name',
    path: '/groups/',
    value: 'id',
    icon: 'people',
    color: '#000000'
  }
};

type State = typeof initialState;

export default function search(state: State = initialState, action: Action) {
  switch (action.type) {
    case Search.SEARCH.BEGIN:
      return {
        ...state,
        query: action.meta.query,
        searching: true
      };

    case Search.AUTOCOMPLETE.BEGIN:
      return {
        ...state,
        query: action.meta.query,
        searching: true
      };

    case Search.SEARCH.SUCCESS:
      if (action.meta.query !== state.query) {
        return state;
      }

      return {
        ...state,
        results: action.payload,
        searching: false
      };

    case Search.AUTOCOMPLETE.SUCCESS:
      if (action.meta.query !== state.query) {
        return state;
      }

      return {
        ...state,
        autocomplete: action.payload,
        searching: false
      };

    case Search.SEARCH.FAILURE:
      return {
        ...state,
        searching: false
      };

    case Search.AUTOCOMPLETE.FAILURE:
      return {
        ...state,
        searching: false
      };

    case Search.TOGGLE_OPEN:
      return {
        ...state,
        autocomplete: [],
        open: !state.open
      };

    default:
      return state;
  }
}

const transformResult = result => {
  const fields = searchMapping[result.contentType];
  const item = {};

  Object.keys(fields).forEach(field => {
    item[field] = result[fields[field]] || fields[field];
  });

  if (fields.link) {
    item.link = fields.link(result);
  } else {
    item.link = item.path + item.value;
  }

  return item;
};

export const selectAutocomplete = autocomplete =>
  autocomplete.map(result => transformResult(result));

export const selectAutocompleteDeprecated = createSelector(
  state => state.search.autocomplete,
  autocomplete => autocomplete.map(result => transformResult(result))
);

export const selectResult = createSelector(
  state => state.search.results,
  results => results.map(result => transformResult(result))
);
