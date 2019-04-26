import { createSelector } from 'reselect';
import { get } from 'lodash';
import { Search } from '../actions/ActionTypes';
import moment from 'moment-timezone';
import { resolveGroupLink } from 'app/reducers/groups';
import { categoryOptions } from 'app/reducers/pages';

const initialState = {
  results: [],
  autocomplete: [],
  query: '',
  searching: false,
  open: false
};

const searchMapping = {
  'users.user': {
    label: user => `${user.fullName} (${user.username})`,
    title: 'fullName',
    type: 'Bruker',
    color: '#A1C34A',
    value: 'id',
    username: 'username',
    link: user => `/users/${user.username}`,
    id: 'id',
    profilePicture: 'profilePicture'
  },
  'articles.article': {
    icon: 'book',
    label: 'title',
    title: 'title',
    type: 'Artikkel',
    picture: 'cover',
    color: '#52B0EC',
    path: '/articles/',
    value: 'id',
    content: item => item['description']
  },
  'events.event': {
    label: event =>
      `${event.title} (${moment(event.startTime).format('YYYY-MM-DD')})`,
    title: 'title',
    type: 'Arrangement',
    date: 'startTime',
    icon: 'calendar',
    color: '#E8953A',
    picture: 'cover',
    path: '/events/',
    value: 'id',
    content: item => item['description']
  },
  'flatpages.page': {
    icon: 'paper-outline',
    label: 'title',
    title: 'title',
    type: page =>
      'Infoside - ' +
      get(categoryOptions.find(val => val.value === page.category), 'label'),
    color: '#E8953A',
    link: page => `/pages/${page.category}/${page.slug}`,
    value: 'slug',
    content: item => item['content']
  },
  'gallery.gallery': {
    label: 'title',
    title: 'title',
    type: 'Galleri',
    color: '#F8953A',
    icon: 'photos',
    path: '/photos/',
    value: 'id',
    content: item => item['text']
  },
  'companies.company': {
    icon: 'briefcase',
    label: 'name',
    title: 'name',
    type: 'Bedrift',
    color: '#E8953A',
    path: '/companies/',
    value: 'id',
    content: item => item['description']
  },
  'tags.tag': {
    label: 'id',
    title: 'id',
    type: 'Tag',
    path: '/tags/',
    icon: 'pricetags',
    value: 'tag',
    color: '#000000'
  },
  'users.abakusgroup': {
    label: 'name',
    title: 'name',
    link: resolveGroupLink,
    value: 'id',
    profilePicture: 'logo',
    id: 'id',
    type: 'type',
    icon: group => (group.profilePicture ? null : 'people'),
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

/*
 * This transfors the search results (both search and autocomplete) from the backend.
 * If the element has no valid url, it will be returned as null. You should therefore
 * always filter out null values:
 *
 * const mapped = results.map(transformResult).filter(Boolean)
 */
const transformResult = result => {
  const fields = searchMapping[result.contentType];
  const item = {};

  Object.keys(fields).forEach(field => {
    const value = fields[field];
    if (typeof value === 'function') {
      item[field] = value(result);
    } else {
      item[field] = result[value] || value;
    }
  });

  item.link = fields.link ? item.link : item.path + item.value;
  return item;
};

export const selectAutocomplete = (autocomplete: Array<any>) =>
  autocomplete.map(transformResult).filter(Boolean);

export const selectAutocompleteRedux = createSelector(
  state => state.search.autocomplete,
  autocomplete => autocomplete.map(transformResult).filter(Boolean)
);

export const selectResult = createSelector(
  state => state.search.results,
  results => results.map(transformResult).filter(Boolean)
);
