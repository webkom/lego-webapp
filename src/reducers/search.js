import createReducer from '../utils/createReducer';
import { Search } from '../actions/ActionTypes';

const initialState = {
  results: [],
  query: '',
  searching: false
};

export default createReducer(initialState, {
  [Search.SEARCH]: (state, action) => ({
    ...state,
    query: action.payload,
    searching: true
  }),

  [Search.RESULTS_RECEIVED]: (state, action) => ({
    ...state,
    results: action.payload,
    searching: false
  })
});
