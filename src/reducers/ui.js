import createReducer from '../util/createReducer';
import * as ActionTypes from '../actions/ActionTypes';

const initialState = {
  menuOpen: false,
  loginOpen: false
};

export default createReducer(initialState, {
  [ActionTypes.UI.TOGGLE_MENU]: (state, _) => ({ ...state, menuOpen: !state.menuOpen }),
  [ActionTypes.UI.OPEN_MENU]: (state, _) => ({ ...state, menuOpen: true }),
  [ActionTypes.UI.CLOSE_MENU]: (state, _) => ({ ...state, menuOpen: false }),
  [ActionTypes.UI.TOGGLE_LOGIN]: (state, _) => ({ ...state, loginOpen: !state.loginOpen }),
  [ActionTypes.User.LOGIN_SUCCESS]: (state, _) => ({ ...state, loginOpen: false })
});
