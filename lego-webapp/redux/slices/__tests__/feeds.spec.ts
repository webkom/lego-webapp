import { describe, it, expect } from 'vitest';
import { Feed } from '~/redux/actionTypes';
import { createRootReducer } from '~/redux/rootReducer';
import feeds, { selectFeedActivitiesByFeedId } from '../feeds';
import type { FeedType } from '~/redux/models/Feed';

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

    it('skips feed activity IDs that have not been normalized', () => {
      const initialState = createRootReducer()(undefined, {
        type: '@@test/init',
      });
      const presentActivity = {
        id: 'present',
        orderingKey: 'present',
        verb: 'comment',
        createdAt: '',
        updatedAt: '',
        lastActivity: {
          activityId: 'present',
          verb: 0,
          time: '',
          extraContext: {},
          actor: '',
          object: '',
          target: '',
        },
        activities: [],
        activityCount: 0,
        actorIds: [],
        read: false,
        seen: false,
        context: {},
      };
      const state = {
        ...initialState,
        feeds: {
          ...initialState.feeds,
          entities: {
            ...initialState.feeds.entities,
            personal: {
              id: 'personal',
              type: 'personal',
              activities: ['missing', 'present'],
            },
          },
        },
        feedActivities: {
          ...initialState.feedActivities,
          entities: {
            ...initialState.feedActivities.entities,
            present: presentActivity,
          },
        },
      };

      expect(selectFeedActivitiesByFeedId(state, 'personal')).toEqual([
        expect.objectContaining({
          id: 'present',
          verb: 'comment',
        }),
      ]);
    });
  });
});
