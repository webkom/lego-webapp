import createReducer from '../utils/createReducer';
import { Notifications } from '../actions/ActionTypes';

const initialState = [
  {
    message: 'hi',
    id: 1
  },
  {
    message: 'yo',
    id: 2
  },
  {
    message: 'yo',
    id: 3
  },
  {
    message: 'yo',
    id: 4
  },
  {
    message: 'yo',
    id: 5
  }
];

export default createReducer(initialState, {
  [Notifications.NOTIFICATION_ADDED]: (state, action) => ([
    ...state,
    action.payload
  ]),

  [Notifications.NOTIFICATION_REMOVED]: (state, action) => {
    return state.map((notification) => {
      if (notification.id === action.payload.id) {
        notification.removed = true;
      }
      return notification;
    });
  }
});
