import createReducer from '../utils/createReducer';
import { Notifications } from '../actions/ActionTypes';

const initialState = {
  items: []
};

export default createReducer(initialState, {
  [Notifications.NOTIFICATION_ADDED]: (state, action) => ({
    ...state,
    items: [
      ...state.items,
      action.payload
    ]
  }),
  [Notifications.NOTIFICATION_REMOVED]: (state, action) => ({
    ...state,
    items: state.items.map((notification) => {
      if (notification.id === action.payload.id) {
        notification.removed = true;
      }
      return notification;
    })
  })
});
