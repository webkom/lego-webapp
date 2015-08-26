import createReducer from '../createReducer';
import { Search } from '../actions/ActionTypes';

const initialState = {
  results: [],
  closed: false,
  query: ''
};

export default createReducer(initialState, {
  [Search.CLEAR]: (state, action) => ({ ...state, closed: true, query: '' }),
  [Search.SEARCH]: (state, action) => ({ ...state, query: action.payload })
});
