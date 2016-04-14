import { Notifications } from './ActionTypes';

export function removeNotification({ id }) {
  return {
    type: Notifications.NOTIFICATION_REMOVED,
    payload: {
      id
    }
  };
}

export function addNotification({ message, id }) {
  return {
    type: Notifications.NOTIFICATION_ADDED,
    payload: {
      id,
      message,
      dismissAfter: 1500
    }
  };
}
