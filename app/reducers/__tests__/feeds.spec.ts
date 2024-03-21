import { describe, it, expect } from 'vitest';
import { Feed } from 'app/actions/ActionTypes';
import feeds from '../feeds';
import type FeedType from 'app/store/models/Feed';

describe('reducers', () => {
  describe('feeds', () => {
    it('Fetching feed populates state correctly', () => {
      const prevState: ReturnType<typeof feeds> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: ['x'],
        entities: {
          x: {} as FeedType,
        },
      };
      const action = {
        type: Feed.FETCH.SUCCESS,
        meta: {
          feedId: 'user-123',
        },
        payload: {
          result: [1, 2, 3],
        },
      };
      expect(feeds(prevState, action)).toEqual({
        ...prevState,
        ids: ['x', 'user-123'],
        entities: {
          x: {},
          ['user-123']: {
            id: 'user-123',
            type: 'user',
            activities: [1, 2, 3],
          },
        },
      });
    });
  });
});
