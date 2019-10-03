// @flow

import { NotificationsFeed } from '../actions/ActionTypes';
import produce from 'immer';

const initialState = {
  unreadCount: 0,
  unseenCount: 0
};

type State = typeof initialState;

const notificationsFeed = produce(
  (newState: State, action: any): void | State => {
    switch (action.type) {
      case NotificationsFeed.FETCH_DATA.SUCCESS:
        newState.unreadCount = action.payload.unreadCount;
        newState.unseenCount = action.payload.unseenCount;
        break;

      case NotificationsFeed.MARK_ALL.SUCCESS:
        return initialState;
    }
  },
  initialState
);

export default notificationsFeed;
