import createReducer from '../createReducer';
import { User } from '../actions/ActionTypes';

const initialState = {};

export default createReducer(initialState, {
  [User.LOGIN_SUCCESS]: (state, action) => {
    const { username } = action.payload.user;
    return {
      ...state,
      [username]: action.payload.user
    };
  },
  [User.FETCH_USER_SUCCESS]: (state, action) => {
    const { username } = action.payload;
    return {
      ...state,
      [username]: action.payload
    };
  }
});
