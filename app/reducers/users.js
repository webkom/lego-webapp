// @flow

import { createSelector } from 'reselect';
import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type UserEntity = {
  id: number,
  username: string,
  fullName: string,
  firstName: string,
  lastName: string,
  gender: string,
  profilePicture: string
};

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case User.CONFIRM_STUDENT_USER.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.username]: action.payload
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectUserById = createSelector(
  state => state.users.byId,
  (state, props) => props.userId,
  (usersById, userId) => {
    const user = usersById[userId];
    if (user) {
      return user;
    }
    return {};
  }
);
