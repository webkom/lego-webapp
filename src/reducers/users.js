import createReducer from '../utils/createReducer';
import { User, Group } from '../actions/ActionTypes';

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
  },
  [Group.FETCH_SUCCESS]: (state, action) => {
    const loadedUsers = action.payload.users.reduce( (acc, user) => {
      acc[user.username] = user;
      return acc;
    }, {});
    return {
      ...loadedUsers,
      ...state
    };
  }
});
