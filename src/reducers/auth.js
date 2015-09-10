import createReducer from '../createReducer';
import { User } from '../actions/ActionTypes';

const initialState = {
  username: null,
  token: null
};

export default createReducer(initialState, {
  [User.LOGIN_SUCCESS]: (state, action) => ({ ...state, ...action.payload }),
  [User.LOGOUT]: (state, action) => ({ ...state, username: null, token: null })
});
