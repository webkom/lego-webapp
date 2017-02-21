import { Feed } from './ActionTypes';
import callAPI from './callAPI';
import { feedActivitySchema } from 'app/reducers';
import { arrayOf } from 'normalizr';
import { feedIdByUsername } from 'app/reducers/feeds';

export function fetchUserFeed(username) {
  return callAPI({
    types: Feed.FETCH,
    endpoint: `/feed/user/${username}/`,
    schema: arrayOf(feedActivitySchema),
    meta: {
      feedId: feedIdByUsername(username)
    }
  });
}
