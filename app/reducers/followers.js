// @flow

import { createSelector } from 'reselect';
import { selectCurrentUser } from './auth';

export const selectFollowersCurrentUser = createSelector(
  (state, props) =>
    selectFollowers(state, {
      ...props,
      follower: selectCurrentUser(state) && selectCurrentUser(state).id,
    }),
  (follow) => follow
);

export const selectFollowers = createSelector(
  (state, { type }) =>
    state[
      'followers' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase()
    ],
  (state, { target }) => target,
  (state, { follower }) => follower,
  (followers, target, follower) =>
    followers.byId[
      followers.items.find(
        (item) =>
          followers.byId[item].follower.toString() === follower.toString() &&
          followers.byId[item].target.toString() === target.toString()
      )
    ]
);
