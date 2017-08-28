// @flow

import { Feed } from './ActionTypes';
import callAPI from './callAPI';
import { feedActivitySchema } from 'app/reducers';

import { feedIdByUsername } from 'app/reducers/feeds';

export function fetchUserFeed(username) {
  return callAPI({
    types: Feed.FETCH,
    endpoint: `/feed-user/${username}/`,
    schema: [feedActivitySchema],
    meta: {
      feedId: feedIdByUsername(username)
    }
  });
}

export function fetchNotificationFeed() {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed-notifications/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'notifications'
    }
  });
}
