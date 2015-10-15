import createReducer from '../util/createReducer';
import { Quotes } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

export default createReducer(initialState, {
  [Quotes.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Quotes.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Quotes.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload })
});
