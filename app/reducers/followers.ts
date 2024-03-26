import { Event } from 'app/actions/ActionTypes';
import { createFollowersSliceKey } from 'app/reducers/index';
import createEntityReducer from 'app/utils/createEntityReducer';
import type { EntityReducerTypes } from 'app/utils/createEntityReducer';

const followersSchemaGenerator = (
  title,
  types: {
    fetch?: EntityReducerTypes;
    mutate?: EntityReducerTypes;
    delete?: EntityReducerTypes;
  } = {},
) =>
  createEntityReducer({
    key: createFollowersSliceKey(title),
    types,
  });

export const followersEvent = followersSchemaGenerator('Event', {
  mutate: [Event.FOLLOW],
  delete: [Event.UNFOLLOW],
});
export const followersCompany = followersSchemaGenerator('Company');
export const followersUser = followersSchemaGenerator('User');
