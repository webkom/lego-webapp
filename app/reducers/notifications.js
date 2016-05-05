import { Notifications } from '../actions/ActionTypes';

const initialState = {
  items: []
};

function generateNotification({
  action = 'Close',
  dismissAfter = 3000,
  id = Date.now() + Math.round(Math.random() * 1000),
  message = 'Notification'
} = {}) {
  return {
    action,
    dismissAfter,
    id,
    message
  };
}


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
      if (action.error && action.meta && action.meta.errorMessage) {
        const errorMessage = typeof action.meta.errorMessage === 'function' ?
          action.meta.errorMessage(action.error) :
          action.meta.errorMessage;

        const error = generateNotification({ message: errorMessage });

        return {
          ...state,
          items: [
            ...state.items,
            error
          ]
        };
      }
      return state;
  }
}
