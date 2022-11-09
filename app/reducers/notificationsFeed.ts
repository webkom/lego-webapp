import { produce } from 'immer';
import { NotificationsFeed } from '../actions/ActionTypes';

const initialState = {
  unreadCount: 0,
  unseenCount: 0,
};
type State = typeof initialState;
const notificationsFeed = produce<State>(
  (newState: State, action: any): void | State => {
    switch (action.type) {
      case NotificationsFeed.FETCH_DATA.SUCCESS:
        newState.unreadCount = action.payload.unreadCount;
        newState.unseenCount = action.payload.unseenCount;
        break;

      case NotificationsFeed.MARK_ALL.SUCCESS:
        return initialState;

      default:
        break;
    }
  },
  initialState
);
export default notificationsFeed;
