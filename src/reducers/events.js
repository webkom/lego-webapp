import createReducer from '../util/createReducer';
import { Events } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

export default createReducer(initialState, {
  [Events.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Events.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Events.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload })
});
