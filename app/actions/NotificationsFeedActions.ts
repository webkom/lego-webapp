import { selectIsLoggedIn } from 'app/reducers/auth';
import type { Thunk } from 'app/types';
import { NotificationsFeed } from './ActionTypes';
import callAPI from './callAPI';

export function fetchNotificationData(): Thunk<any> {
  return (dispatch, getState) => {
    if (!selectIsLoggedIn(getState())) {
      return Promise.resolve();
    }

    return dispatch(
      callAPI({
        types: NotificationsFeed.FETCH_DATA,
        endpoint: '/feed-notifications/notification_data/',
      })
    );
  };
}
export function markAllNotifications(): Thunk<any> {
  return callAPI({
    types: NotificationsFeed.MARK_ALL,
    endpoint: '/feed-notifications/mark_all/',
    method: 'POST',
    body: {
      read: true,
      seen: true,
    },
  });
}
