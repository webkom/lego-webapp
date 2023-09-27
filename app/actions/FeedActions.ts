import { feedActivitySchema } from 'app/reducers';
import { feedIdByUserId } from 'app/reducers/feeds';
import type { Thunk } from 'app/types';
import { Feed } from './ActionTypes';
import callAPI from './callAPI';

export function fetchUserFeed(userId: string): Thunk<any> {
  return callAPI({
    types: Feed.FETCH,
    endpoint: `/feed-user/${userId}/`,
    schema: [feedActivitySchema],
    meta: {
      feedId: feedIdByUserId(userId),
    },
  });
}
export function fetchPersonalFeed(): Thunk<Promise<void>> {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed-personal/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'personal',
    },
  });
}
export function fetchNotificationFeed(): Thunk<any> {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed-notifications/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'notifications',
    },
  });
}
