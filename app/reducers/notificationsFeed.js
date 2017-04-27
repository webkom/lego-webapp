import { NotificationsFeed } from '../actions/ActionTypes';

const initialState = {
  unreadCount: 0,
  unseenCount: 0
};

export default function notificationsFeed(state = initialState, action) {
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
