import createReducer from '../createReducer';
import * as ActionTypes from '../actions/ActionTypes';

const initialState = {
  menuOpen: false,
  loginOpen: false
};

export default createReducer(initialState, {
  [ActionTypes.UI.TOGGLE_MENU]: (state, _) => ({ ...state, menuOpen: !state.menuOpen })
});
