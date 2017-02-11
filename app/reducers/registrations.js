import { omit } from 'lodash';
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'registrations',
  types: {
    fetch: false
  },
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.PAYMENT_QUEUE.SUCCESS:
      case Event.SOCKET_PAYMENT.FAILURE: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: {
              ...action.payload
            }
          }
        };
      }
      case Event.SOCKET_UNREGISTRATION.SUCCESS: {
        return {
          ...state,
          byId: {
            ...omit(state.byId, action.payload.id)
          }
        };
      }
      default:
        return state;
    }
  }
});
