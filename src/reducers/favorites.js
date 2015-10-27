import createReducer from '../util/createReducer';
import { Favorite } from '../actions/ActionTypes';

const initialState = {
  items: []
};

export default createReducer(initialState, {
  [Favorite.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, items: action.payload })
});
