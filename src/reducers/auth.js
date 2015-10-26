import createReducer from '../util/createReducer';
import { User } from '../actions/ActionTypes';

const initialState = {
  username: null,
  token: null,
  loginFailed: false,
  loggingIn: false
};

export default createReducer(initialState, {
  [User.LOGIN_BEGIN]: (state, _) => ({
    ...state,
    loggingIn: true,
    loginFailed: false
  }),

  [User.LOGIN_FAILURE]: (state, _) => ({
    ...state,
    loginFailed: true
  }),

  [User.LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    loggingIn: false,
    username: action.payload.user.username,
    token: action.payload.token
  }),

  [User.LOGOUT]: (state, _) => ({
    ...state,
    username: null,
    token: null
  })
});
