import createReducer from '../util/createReducer';
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
  [User.FETCH_SUCCESS]: (state, action) => {
    const { username } = action.payload;
    return {
      ...state,
      [username]: action.payload
    };
  },
  [User.UPDATE_SUCCESS]: (state, action) => {
    const { username } = action.payload;
    return {
      ...state,
      [username]: action.payload
    };
  }
});
