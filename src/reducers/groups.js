import createReducer from '../util/createReducer';
import { Groups } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

export default createReducer(initialState, {
  [Groups.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Groups.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Groups.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload })
});
