import { describe, it, expect } from 'vitest';
import { NotificationsFeed } from '../../actions/ActionTypes';
import notificationsFeed from '../notificationsFeed';

describe('reducers', () => {
  describe('NotificationsFeed.FETCH_DATA.SUCCESS', () => {
    it('NotificationsFeed.FETCH_DATA.SUCCESS', () => {
      const prevState = {
        unreadCount: 0,
        unseenCount: 0,
      };
      const action = {
        type: NotificationsFeed.FETCH_DATA.SUCCESS,
        payload: {
          unreadCount: 1,
          unseenCount: 2,
        },
      };
      expect(notificationsFeed(prevState, action)).toEqual({
        unreadCount: 1,
        unseenCount: 2,
      });
    });
    it('NotificationsFeed.MARK_ALL.SUCCESS', () => {
      const prevState = {
        unreadCount: 9,
        unseenCount: 5,
      };
      const action = {
        type: NotificationsFeed.MARK_ALL.SUCCESS,
      };
      expect(notificationsFeed(prevState, action)).toEqual({
        unreadCount: 0,
        unseenCount: 0,
      });
    });
  });
});
