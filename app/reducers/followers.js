// @flow

import { Event } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { selectCurrentUser } from './auth';

const followers = createEntityReducer({
  key: 'followers',
  types: {
    mutate: [Event.FOLLOW],
    delete: [Event.UNFOLLOW],
  },
});

export const selectFollowersCurrentUser = createSelector(
  (state, props) =>
    selectFollowers(state, {
      ...props,
      follower: selectCurrentUser(state) && selectCurrentUser(state).id,
    }),
  (follow) => follow
);

export const selectFollowers = createSelector(
  (state) => state.followers,
  (state, { type }) => type,
  (state, { target }) => target,
  (state, { follower }) => follower,
  (followers, type, target, follower) =>
    followers.byId[
      followers.items
        .filter((item) => item.includes(type))
        .find(
          (item) =>
            followers.byId[item].follower.toString() === follower.toString() &&
            followers.byId[item].target.toString() === target.toString()
        )
    ]
);

export default followers;
