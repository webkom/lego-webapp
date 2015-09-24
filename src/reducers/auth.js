import createReducer from '../createReducer';
import { User } from '../actions/ActionTypes';

const initialState = {
  username: null,
  token: null
};

export default createReducer(initialState, {
  [User.LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    username: action.payload.user.username,
    token: action.payload.token
  }),
  [User.LOGOUT]: (state, action) => ({ ...state, username: null, token: null })
});
