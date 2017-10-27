// @flow

import { createSelector } from 'reselect';
import { Search } from '../actions/ActionTypes';

export type SearchResult = {
  label: string,
  color: string,
  picture: string,
  path: string,
  value: string,
  link: string,
  content: string,
  icon: string
};

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
    value: 'id',
    username: 'username',
    path: user => `/users/${user.username}`,
    id: 'id',
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
    profilePicture: 'picture',
    icon: 'paper-outline',
    label: 'title',
    color: '#E8953A',
    path: '/pages/info/',
    value: 'slug',
    content: 'content'
  },
  'gallery.gallery': {
    profilePicture: 'picture',
    label: 'title',
    color: '#F8953A',
    icon: 'photos',
    path: '/photos/',
    value: 'id',
    content: 'text'
  },
  'companies.company': {
    icon: 'briefcase',
    label: 'name',
    color: '#E8953A',
    path: '/companies/',
    value: 'id',
    content: 'content'
  },
  'companies.companycontact': {
    label: 'name',
    company: 'company',
    value: 'id'
  },
  'tags.tag': {
    label: 'id',
    path: '/tags/',
    icon: 'pricetags',
    value: 'tag',
    color: '#000000'
  },
  'users.abakusgroup': {
    label: 'name',
    path: group => {
      switch (group.type) {
        case 'interesse':
          return `/interestgroups/${group.id}`;
        case 'komite':
          return `/pages/komiteer/${group.id}`;
        default:
          return `group/${group.id}`;
      }
    },
    value: 'id',
    profilePicture: 'logo',
    id: 'id',
    type: 'type',
    icon: 'people',
    color: '#000000'
  }
};

type State = typeof initialState;

export default function search(state: State = initialState, action: any) {
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

  item.profilePicture =
    item.profilePicture === fields.profilePicture ? '' : item.profilePicture;

  if (fields.link) {
    item.link = fields.link(result);
  } else if (typeof fields.path === 'function') {
    item.link = fields.path(item);
  } else {
    item.link = item.path + item.value;
  }

  return item;
};

export const selectAutocomplete = (autocomplete: Array<any>) =>
  autocomplete.map(result => transformResult(result));

export const selectAutocompleteRedux = createSelector(
  state => state.search.autocomplete,
  autocomplete => autocomplete.map(result => transformResult(result))
);

export const selectResult = createSelector(
  state => state.search.results,
  results => results.map(result => transformResult(result))
);
