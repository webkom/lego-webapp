// @flow

import { NotificationsFeed, Feed } from './ActionTypes';
import callAPI from './callAPI';
import { feedActivitySchema } from 'app/reducers';
import { selectIsLoggedIn } from 'app/reducers/auth';
import isRequestNeeded from 'app/utils/isRequestNeeded';

const reducerKey = 'notificationsFeed';

export function fetchNotificationData() {
  return (dispatch, getState) => {
    if (selectIsLoggedIn(getState())) {
      dispatch(
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

export function markNotification(notificationId) {
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
