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
      case Event.SOCKET_UNREGISTRATION.SUCCESS: {
        return {
          ...state,
          byId: {
            ...omit(state.byId, action.payload.id)
          },
          items: state.items.filter(item => item !== action.payload.id)
        };
      }
      case Event.UNREGISTER.SUCCESS: {
        if (action.meta.admin) {
          return {
            ...state,
            byId: {
              ...state.byId,
              [action.meta.optimisticId]: {
                ...state.byId[action.meta.id],
                unregistrationDate: moment()
              }
            },
            items: [...state.items, action.meta.optimisticId]
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
