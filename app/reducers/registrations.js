import { omit } from 'lodash';
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment';

export default createEntityReducer({
  key: 'registrations',
  types: {
    fetch: false
  },
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.PAYMENT_QUEUE.SUCCESS:
      case Event.SOCKET_PAYMENT.SUCCESS:
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
      case Event.UNREGISTER.SUCCESS: {
        if (action.meta.admin) {
          return {
            ...state,
            byId: {
              ...state.byId,
              [action.payload.id]: {
                ...state.byId[action.payload.id],
                unregistrationDate: moment()
              }
            }
          };
        }
        return state;
      }
      case Event.UPDATE_REGISTRATION.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: {
              ...state.byId[action.payload.id],
              ...action.payload
            }
          }
        };
      }
      default:
        return state;
    }
  }
});
