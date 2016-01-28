import createReducer from '../utils/createReducer';
import { Search } from '../actions/ActionTypes';

const initialState = {
  results: [],
  query: '',
  searching: false
};

export default createReducer(initialState, {
  [Search.SEARCH_BEGIN]: (state, action) => ({
    ...state,
    query: action.meta.query,
    searching: true
  }),

  [Search.SEARCH_SUCCESS]: (state, action) => {
    // Don't overwrite if the results for an old query returns
    if (action.meta.query !== state.query) {
      return state;
    }
    return {
      ...state,
      results: action.payload,
      searching: false
    };
  }
});
