// @flow

import { createSelector } from 'reselect';
import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type UserEntity = {
  username: string
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
      case User.FOLLOW_USER.SUCCESS: {
        const me = action.meta.follower.username;
        const user = action.meta.user.id;
        const following = (state.byId[me].following || [])
          .filter(id => id !== user)
          .concat(user);
        return {
          ...state,
          byId: {
            ...state.byId,
            [me]: {
              ...state.byId[me],
              following
            }
          }
        };
      }
      case User.UNFOLLOW_USER.SUCCESS: {
        const me = action.meta.follower.username;
        const user = action.meta.user.id;
        const following = (state.byId[me].following || []).filter(
          id => id !== user
        );
        return {
          ...state,
          byId: {
            ...state.byId,
            [me]: {
              ...state.byId[me],
              following
            }
          }
        };
      }
      case User.FETCH_USER_FOLLOWINGS.SUCCESS: {
        const me = action.meta.currentUser.username;
        return {
          ...state,
          byId: {
            ...state.byId,
            [me]: {
              ...state.byId[me],
              following: action.payload.map(f => f.target)
            }
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
