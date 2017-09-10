// @flow

import { Notifications } from '../actions/ActionTypes';
import { union } from 'lodash';
import type { Action } from 'app/types';

const initialState = {
  items: []
};

type State = typeof initialState;

export default function notifications(
  state: State = initialState,
  action: Action
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
            notification.removed = true;
          }
          return notification;
        })
      };

    default:
      return state;
  }
}
