import { createSelector } from 'reselect';
import { Event } from 'app/actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { selectCurrentUser } from './auth';
import type { EntityReducerTypes } from 'app/utils/createEntityReducer';

export const selectFollowersCurrentUser = createSelector(
  (state, props) =>
    selectFollowers(state, {
      ...props,
      follower: selectCurrentUser(state) && selectCurrentUser(state).id,
    }),
  (follow) => follow,
);
export const selectFollowers = createSelector(
  (state, { type }) => state[followersKeyGen(type)],
  (state, { target }) => target,
  (state, { follower }) => follower,
  (followers, target, follower) =>
    followers.byId[
      followers.items.find(
        (item) =>
          followers.byId[item].follower.toString() === follower?.toString() &&
          followers.byId[item].target.toString() === target.toString(),
      )
    ],
);
export const followersKeyGen = (key: string) =>
  'followers' + key.charAt(0).toUpperCase() + key.substr(1).toLowerCase();

const followersSchemaGenerator = (
  title,
  types: {
    fetch?: EntityReducerTypes;
    mutate?: EntityReducerTypes;
    delete?: EntityReducerTypes;
  } = {},
) =>
  createEntityReducer({
    key: followersKeyGen(title),
    types,
  });

export const followersEvent = followersSchemaGenerator('Event', {
  mutate: [Event.FOLLOW],
  delete: [Event.UNFOLLOW],
});
export const followersCompany = followersSchemaGenerator('Company');
export const followersUser = followersSchemaGenerator('User');
