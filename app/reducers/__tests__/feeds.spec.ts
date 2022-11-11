import { fetchFeed } from 'app/actions/FeedActions';
import type Feed from 'app/store/models/Feed';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import feeds, { FeedsState } from '../feeds';

describe('reducers', () => {
  describe('feeds', () => {
    it('Fetching feed populates state correctly', () => {
      const prevState: FeedsState = {
        ...getInitialEntityReducerState(),
        items: ['x'],
        byId: {
          x: {} as Feed,
        },
      };
      const action = fetchFeed.success({
        meta: {
          feedId: 'notifications',
        },
        payload: {
          entities: {
            feedActivities: {},
          },
          result: [1, 2, 3],
        },
      });
      expect(feeds(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: ['x', 'notifications'],
        byId: {
          x: {},
          notifications: {
            type: 'notifications',
            activities: [1, 2, 3],
          },
        },
      });
    });
  });
});
