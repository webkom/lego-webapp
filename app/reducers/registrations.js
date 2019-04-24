// @flow

import { union } from 'lodash';
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import { omit } from 'lodash';
import moment from 'moment-timezone';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'registrations',
  types: {},
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Event.SOCKET_EVENT_UPDATED: {
          const registrations =
            normalize(action.payload, eventSchema).entities.registrations || {};
          newState.byId = mergeObjects(newState.byId, registrations);
          newState.items = union(
            newState.items,
            Object.keys(registrations).map(Number)
          );
          break;
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
            return;
          }
          newState.byId[registration.id] = {
            ...omit(newState.byId[registration.id], 'unregistrationDate'),
            ...registration
          };
          break;
        }

        case Event.REQUEST_UNREGISTER.BEGIN:
          newState.byId[action.meta.id].fetching = true;
          break;

        case Event.REQUEST_UNREGISTER.FAILURE:
          newState.byId[action.meta.id].fetching = false;
          break;

        case Event.UPDATE_REGISTRATION.SUCCESS: {
          const registration = normalize(action.payload, registrationSchema)
            .entities.registrations[action.payload.id];
          newState.byId[action.payload.id] = {
            ...newState.byId[action.payload.id],
            ...registration
          };
          break;
        }

        case Event.SOCKET_UNREGISTRATION.SUCCESS: {
          const transformedPayload = {
            ...action.payload,
            fetching: false,
            unregistrationDate: moment()
          };
          const registrations = normalize(
            transformedPayload,
            registrationSchema
          ).entities.registrations;
          newState.byId = mergeObjects(newState.byId, registrations);
          newState.items = union(newState.items, [action.payload.id]);
          break;
        }
      }
    }
  )
});
