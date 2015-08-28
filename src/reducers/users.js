import createReducer from '../createReducer';
import { User } from '../actions/ActionTypes';

const initialState = {
  userInfo: null
};

export default createReducer(initialState, {
  [User.LOGIN_SUCCESS]: (state, action) => ({ ...state, userInfo: action.payload }),
  [User.LOGOUT]: (state, action) => ({ ...state, userInfo: null })
});
