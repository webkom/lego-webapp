// @flow

import { NotificationsFeed } from '../actions/ActionTypes';
import type { Action } from 'app/types';

const initialState = {
  unreadCount: 0,
  unseenCount: 0
};

type State = typeof initialState;

export default function notificationsFeed(
  state: State = initialState,
  action: Action
) {
  switch (action.type) {
    case NotificationsFeed.FETCH_DATA.SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    default: {
      return state;
    }
  }
}
