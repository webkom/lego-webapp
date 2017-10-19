// @flow

import { Notifications } from '../actions/ActionTypes';
import { union } from 'lodash';

type Notification = {
  id: number,
  message: string,
  removed: boolean
};

const initialState = {
  items: []
};

type State = {
  items: Array<Notification>
};

export default function notifications(
  state: State = initialState,
  action: any
) {
  switch (action.type) {
    case Notifications.NOTIFICATION_ADDED:
      return {
        ...state,
        items: union(state.items, [action.payload])
      };

    case Notifications.NOTIFICATION_REMOVED:
      return {
        ...state,
        items: state.items.map(notification => {
          if (notification.id === action.payload.id) {
            return { ...notification, removed: true };
          }
          return notification;
        })
      };

    default:
      return state;
  }
}
