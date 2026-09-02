import { Feed } from '~/redux/actionTypes';
import { feedActivitySchema } from '~/redux/schemas';
import { feedIdByUserId } from '~/redux/slices/feeds';
import callAPI from './callAPI';

export function fetchUserFeed(userId: string) {
  return callAPI({
    types: Feed.FETCH,
    endpoint: `/feed-user/${userId}/`,
    schema: [feedActivitySchema],
    meta: {
      feedId: feedIdByUserId(userId),
      errorMessage: 'Henting av brukerfeed feilet.',
    },
  });
}
export function fetchPersonalFeed() {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed-personal/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'personal',
      errorMessage: 'Henting av feeden din feilet.',
    },
  });
}
export function fetchNotificationFeed() {
  return callAPI({
    types: Feed.FETCH,
    endpoint: '/feed-notifications/',
    schema: [feedActivitySchema],
    meta: {
      feedId: 'notifications',
      errorMessage: 'Henting av notifikasjoner feilet.',
    },
  });
}
