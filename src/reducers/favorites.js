import createReducer from '../createReducer';
import { Favorites } from '../actions/ActionTypes';

const initialState = {
  items: []
};

export default createReducer(initialState, {
  [Favorites.LOAD_ALL_SUCCESS]: (state, action) => ({ ...state, items: action.payload })
});
