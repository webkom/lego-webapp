import { Search } from '../actions/ActionTypes';

const initialState = {
  results: [],
  query: '',
  searching: false,
  open: false
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case Search.SEARCH_BEGIN:
      return ({
        ...state,
        query: action.meta.query,
        searching: true
      });

    case Search.SEARCH_SUCCESS:
      if (action.meta.query !== state.query) {
        return state;
      }

      return {
        ...state,
        results: action.payload,
        searching: false
      };

    case Search.SEARCH_FAILURE:
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
