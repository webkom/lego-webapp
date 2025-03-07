import { produce } from 'immer';
import { get } from 'lodash';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { categoryOptions } from '~/pages/pages/page/+Page';
import { Search } from '~/redux/actionTypes';
import { resolveGroupLink } from '~/redux/slices/groups';
import type { User, Event, Group, Meeting, Dateish } from 'app/models';
import type { SearchArticle } from '~/redux/models/Article';
import type { SearchCompany } from '~/redux/models/Company';
import type { RootState } from '~/redux/rootReducer';

type SearchResultBase = {
  type?: string;
  label: string;
  title: string;
  id?: string;
  color?: string;
  picture?: string;
  path?: string;
  value?: string;
  link?: string;
  content?: string;
  icon?: string;
  iconType?: 'icon' | 'image' | 'profilePic';
  date?: Dateish;
  profilePicture?: string;
};

export type UserSearchResult = SearchResultBase & {
  username: string;
  profilePicture: string;
  type: 'Bruker';
  isAbakusMember: boolean;
};

export type SearchResult = SearchResultBase | UserSearchResult;

type SearchResultMapping<T, K = SearchResultBase> = {
  [key in keyof K]: string | ((arg0: T) => string);
};

export const isUserResult = (value: SearchResult): value is UserSearchResult =>
  value.type === 'Bruker';

export const isGroupResult = (value: SearchResult): boolean =>
  value.type === 'komite' || value.type === 'interesse';

interface SearchMapping {
  'users.user': SearchResultMapping<User, UserSearchResult>;
  'articles.article': SearchResultMapping<SearchArticle>;
  'events.event': SearchResultMapping<Event>;
  'flatpages.page': SearchResultMapping<Record<string, string>>;
  'gallery.gallery': SearchResultMapping<any>;
  'companies.company': SearchResultMapping<SearchCompany>;
  'tags.tag': SearchResultMapping<Record<string, string>>;
  'users.abakusgroup': SearchResultMapping<Group>;
  'meetings.meeting': SearchResultMapping<Meeting>;
}

export type RawSearchResult = object & {
  contentType: string;
};

const initialState = {
  results: [],
  autocomplete: [],
  query: '',
  searching: false,
  open: false,
};

export const searchMapping: SearchMapping = {
  'users.user': {
    label: (user) => `${user.fullName} (${user.username})`,
    title: 'fullName',
    type: 'Bruker',
    iconType: 'profilePic',
    color: '#A1C34A',
    value: 'id',
    username: 'username',
    link: (user) => `/users/${user.username}`,
    id: 'id',
    profilePicture: 'profilePicture',
    isAbakusMember: 'isAbakusMember',
  },
  'articles.article': {
    icon: 'book',
    iconType: 'icon',
    label: 'title',
    title: 'title',
    type: 'Artikkel',
    picture: 'cover',
    color: '#52B0EC',
    path: '/articles/',
    value: 'id',
    content: (item) => item['description'],
  },
  'events.event': {
    label: (event) =>
      `${event.title} (${moment(event.startTime).format('YYYY-MM-DD')})`,
    title: 'title',
    type: 'Arrangement',
    date: 'startTime',
    icon: 'calendar',
    iconType: 'icon',
    color: '#E8953A',
    picture: 'cover',
    path: '/events/',
    value: 'id',
    content: (item) => item['description'],
  },
  'flatpages.page': {
    icon: 'information-circle',
    iconType: 'icon',
    label: 'title',
    title: 'title',
    type: (page) =>
      'Infoside - ' +
      get(
        categoryOptions.find((val) => val.value === page.category),
        'label',
      ),
    color: '#E8953A',
    link: (page) => `/pages/${page.category}/${page.slug}`,
    value: 'slug',
    content: (item) => item['content'],
  },
  'gallery.gallery': {
    label: 'title',
    title: 'title',
    type: 'Galleri',
    color: '#F8953A',
    icon: 'image',
    iconType: 'icon',
    path: '/photos/',
    value: 'id',
    content: (item) => item['text'],
  },
  'companies.company': {
    icon: 'briefcase',
    iconType: 'icon',
    label: 'name',
    title: 'name',
    type: 'Bedrift',
    color: '#E8953A',
    path: '/companies/',
    value: 'id',
    content: (item) => item['description'],
  },
  'tags.tag': {
    label: 'id',
    title: 'id',
    type: 'Tag',
    path: '/tags/',
    icon: 'pricetags',
    iconType: 'icon',
    value: 'tag',
    color: '#000000',
  },
  'users.abakusgroup': {
    label: 'name',
    title: 'name',
    link: resolveGroupLink,
    value: 'id',
    profilePicture: 'logo',
    id: 'id',
    type: 'type',
    icon: (group) => group.logo ?? 'people-circle',
    iconType: 'image',
    color: '#000000',
  },
  'meetings.meeting': {
    label: (meeting) =>
      `${meeting.title} (${moment(meeting.startTime).format('YYYY-MM-DD')})`,
    title: 'title',
    type: 'Møte',
    date: 'startTime',
    icon: 'people',
    iconType: 'icon',
    color: '#000000',
    path: '/meetings/',
    value: 'id',
    content: (item) => item['description'],
  },
};
type State = typeof initialState;

const search = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Search.SEARCH.BEGIN:
    case Search.AUTOCOMPLETE.BEGIN:
      newState.query = action.meta.query;
      newState.searching = true;
      break;

    case Search.SEARCH.SUCCESS:
      if (action.meta.query === newState.query) {
        newState.results = action.payload;
        newState.searching = false;
      }

      break;

    case Search.AUTOCOMPLETE.SUCCESS:
      if (action.meta.query === newState.query) {
        newState.autocomplete = action.payload;
        newState.searching = false;
      }

      break;

    case Search.SEARCH.FAILURE:
    case Search.AUTOCOMPLETE.FAILURE:
      newState.searching = false;
      break;

    case Search.TOGGLE_OPEN:
      newState.autocomplete = [];
      newState.open = !newState.open;
      break;

    default:
      break;
  }
}, initialState);
export default search;
/*
 * This transfors the search results (both search and autocomplete) from the backend.
 * If the element has no valid url, it will be returned as null. You should therefore
 * always filter out null values:
 *
 * const mapped = results.map(transformResult).filter(Boolean)
 */

const transformResult = (result: RawSearchResult) => {
  const fields = searchMapping[result.contentType];
  const item: Partial<SearchResult> = {};
  Object.keys(fields).forEach((field) => {
    const value = fields[field];

    if (typeof value === 'function') {
      item[field] = value(result);
    } else {
      item[field] = result[value] || value;
    }
  });
  item.link = fields.link ? item.link : item.path + item.value;
  return item as SearchResult;
};

export const selectAutocomplete = (autocomplete: Array<RawSearchResult>) =>
  autocomplete.map(transformResult).filter(Boolean);

export const selectAutocompleteRedux = createSelector(
  (state: RootState) => state.search.autocomplete,
  (autocomplete) => autocomplete.map(transformResult).filter(Boolean),
);

export const selectResult = createSelector(
  (state: RootState) => state.search.results,
  (results) => results.map(transformResult).filter(Boolean),
);
