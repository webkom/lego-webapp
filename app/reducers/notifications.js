import { Notifications } from '../actions/ActionTypes';

const initialState = {
  items: []
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case Notifications.NOTIFICATION_ADDED:
      return {
        ...state,
        items: [
          ...state.items,
          action.payload
        ]
      };

    case Notifications.NOTIFICATION_REMOVED:
      return {
        ...state,
        items: state.items.map((notification) => {
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
