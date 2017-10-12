// @flow

import { NotificationsFeed } from './ActionTypes';
import callAPI from './callAPI';
import { selectIsLoggedIn } from 'app/reducers/auth';
import type { Thunk } from 'app/types';

export function fetchNotificationData(): Thunk<*> {
  return (dispatch, getState) => {
    if (selectIsLoggedIn(getState())) {
      return dispatch(
        callAPI({
          types: NotificationsFeed.FETCH_DATA,
          endpoint: '/feed-notifications/notification_data/'
        })
      );
    }
  };
}

export function markAllNotifications() {
  return callAPI({
    types: NotificationsFeed.MARK_ALL,
    endpoint: '/feed-notifications/mark_all/',
    method: 'POST',
    body: {
      read: true,
      seen: true
    }
  });
}

export function markNotification(notificationId: number) {
  return callAPI({
    types: NotificationsFeed.MARK,
    endpoint: `/feed-notifications/${notificationId}/mark/`,
    method: 'POST',
    body: {
      read: true,
      seen: true
    }
  });
}
