import { union } from 'lodash';
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import { omit } from 'lodash';
import moment from 'moment-timezone';

export default createEntityReducer({
  key: 'registrations',
  types: {},
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_EVENT_UPDATED: {
        const registrations =
          normalize(action.payload, eventSchema).entities.registrations || {};
        return {
          ...state,
          byId: mergeObjects(state.byId, registrations),
          items: union(state.items, Object.keys(registrations).map(Number))
        };
      }
      case Event.REQUEST_REGISTER.SUCCESS:
      case Event.ADMIN_REGISTER.SUCCESS:
      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.PAYMENT_QUEUE.SUCCESS:
      case Event.SOCKET_PAYMENT.SUCCESS:
      case Event.SOCKET_PAYMENT.FAILURE: {
        const registration = normalize(action.payload, registrationSchema)
          .entities.registrations[action.payload.id];
        if (!registration) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [registration.id]: {
              ...omit(state.byId[registration.id], 'unregistrationDate'),
              ...registration
            }
          },
          items: union(state.items, [registration.id])
        };
      }
      case Event.REQUEST_UNREGISTER.BEGIN: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.id]: {
              ...state.byId[action.meta.id],
              fetching: true
            }
          }
        };
      }
      case Event.REQUEST_UNREGISTER.FAILURE: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.id]: {
              ...state.byId[action.meta.id],
              fetching: false
            }
          }
        };
      }
      case Event.UPDATE_REGISTRATION.SUCCESS: {
        const registration = normalize(action.payload, registrationSchema)
          .entities.registrations[action.payload.id];
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: {
              ...state.byId[action.payload.id],
              ...registration
            }
          }
        };
      }
      case Event.SOCKET_UNREGISTRATION.SUCCESS: {
        const transformedPayload = {
          ...action.payload,
          fetching: false,
          unregistrationDate: moment()
        };
        const registrations = normalize(transformedPayload, registrationSchema)
          .entities.registrations;
        return {
          ...state,
          byId: mergeObjects(state.byId, registrations),
          items: union(state.items, [action.payload.id])
        };
      }
      default:
        return state;
    }
  }
});
