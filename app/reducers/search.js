import { createSelector } from 'reselect';
import { Search } from '../actions/ActionTypes';
import { fromJS } from 'immutable';

const initialState = {
  results: [],
  mentions: fromJS([]),
  query: '',
  searching: false,
  open: false
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case Search.SEARCH.BEGIN:
      return ({
        ...state,
        query: action.meta.query,
        searching: true
      });

    case Search.MENTION.SUCCESS:
      return {
        ...state,
        mentions: fromJS(action.payload)
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

    case Search.SEARCH.FAILURE:
      return {
        ...state,
        searching: false
      };

    case Search.TOGGLE_OPEN:
      return {
        ...state,
        open: !state.open
      };

    default:
      return state;
  }
}

function transformMention(mention) {
  return fromJS({
    id: mention.get('objectId'),
    link: `https://abakus.no/users/${mention.get('objectId')}`,
    avatar: `http://api.adorable.io/avatars/${mention.get('objectId')}.png`,
    name: mention.get('text'),
    username: mention.get('text')
  });
}

export const getMentions = createSelector(
  (state) => state.search.mentions,
  (mentions) => mentions.map((mention) => transformMention(mention))
);
