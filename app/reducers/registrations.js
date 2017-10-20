// @flow

import { union } from 'lodash';
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import moment from 'moment';

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
      case Event.ADMIN_REGISTER.SUCCESS:
      case Event.SOCKET_REGISTRATION.SUCCESS:
      case Event.PAYMENT_QUEUE.SUCCESS:
      case Event.SOCKET_PAYMENT.SUCCESS:
      case Event.SOCKET_PAYMENT.FAILURE: {
        const registrations = normalize(action.payload, registrationSchema)
          .entities.registrations;
        return {
          ...state,
          byId: mergeObjects(state.byId, registrations),
          items: union(state.items, [action.payload.id])
        };
      }
      case Event.UNREGISTER.BEGIN: {
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
      case Event.UNREGISTER.FAILURE: {
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
          byId: mergeObjects(state.byId, registrations)
        };
      }
      default:
        return state;
    }
  }
});
