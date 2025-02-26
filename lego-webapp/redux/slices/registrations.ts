import { createSlice } from '@reduxjs/toolkit';
import { omit, union } from 'lodash';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { Event } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { eventSchema, registrationSchema } from '~/redux/schemas';
import mergeObjects from '~/utils/mergeObjects';
import type { AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Registrations);

const registrationsSlice = createSlice({
  name: EntityType.Registrations,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const registrations =
          normalize(action.payload, eventSchema).entities.registrations || {};
        legoAdapter.upsertMany(state, registrations);
      });
      addCase(Event.REQUEST_UNREGISTER.BEGIN, (state, action: AnyAction) => {
        state.entities[action.meta.id].unregistering = true;
      });
      addCase(Event.REQUEST_UNREGISTER.SUCCESS, (state, action: AnyAction) => {
        const registrations = normalize(action.payload, registrationSchema)
          .entities.registrations!;
        legoAdapter.upsertMany(state, registrations);
        state.entities[action.meta.id].unregistering = false;
      });
      addCase(Event.REQUEST_UNREGISTER.FAILURE, (state, action: AnyAction) => {
        state.entities[action.meta.id].unregistering = false;
      });

      addCase(Event.SOCKET_PAYMENT.SUCCESS, (state, action: AnyAction) => {
        const registration = normalize(action.payload, registrationSchema)
          .entities.registrations?.[action.payload.id];

        if (!registration) {
          return;
        }

        state.entities[registration.id] = {
          ...omit(state.entities[registration.byId], [
            'unregistrationDate',
            'clientSecret',
          ]),
          ...registration,
        };
      });
      addCase(Event.PAYMENT_QUEUE.FAILURE, (state, action: AnyAction) => {
        const registration = normalize(action.payload, registrationSchema)
          .entities.registrations?.[action.payload.id];

        if (!registration) {
          return;
        }

        state.entities[registration.id] = {
          ...omit(state.entities[registration.id], 'unregistrationDate'),
        };
      });
      addCase(
        Event.SOCKET_INITIATE_PAYMENT.SUCCESS,
        (state, action: AnyAction) => {
          const registration = normalize(action.payload, registrationSchema)
            .entities.registrations?.[action.payload.id];

          if (!registration) {
            return;
          }

          const { clientSecret } = action.meta;
          state.entities[registration.id] = {
            ...omit(state.entities[registration.id], 'unregistrationDate'),
            ...registration,
            clientSecret,
          };
        },
      );
      addCase(Event.UPDATE_REGISTRATION.SUCCESS, (state, action: AnyAction) => {
        const registration = normalize(action.payload, registrationSchema)
          .entities.registrations?.[action.payload.id];
        state.entities[action.payload.id] = {
          ...state.entities[action.payload.id],
          ...registration,
        };
      });
      addCase(
        Event.SOCKET_UNREGISTRATION.SUCCESS,
        (state, action: AnyAction) => {
          const transformedPayload = {
            ...action.payload,
            fetching: false,
            unregistrationDate: moment().toISOString(),
          };
          const registrations = normalize(
            transformedPayload,
            registrationSchema,
          ).entities.registrations!;
          legoAdapter.upsertMany(state, registrations);
        },
      );
    },
    extraMatchers: (addMatcher) => {
      addMatcher(
        (action) =>
          action.type === Event.REQUEST_REGISTER.SUCCESS ||
          action.type === Event.ADMIN_REGISTER.SUCCESS ||
          action.type === Event.SOCKET_REGISTRATION.SUCCESS ||
          action.type === Event.SOCKET_PAYMENT.FAILURE,
        (state, action: AnyAction) => {
          const registration = normalize(action.payload, registrationSchema)
            .entities.registrations?.[action.payload.id];

          if (!registration) {
            return;
          }

          state.entities[registration.id] = {
            ...omit(state.entities[registration.id], 'unregistrationDate'),
            ...registration,
          };

          if (action.meta && action.meta.paymentError) {
            mergeObjects(state.entities[registration.id], {
              paymentError: action.meta.paymentError,
            });
          }

          state.ids = union(state.ids, [registration.id]);
        },
      );
    },
  }),
});

export default registrationsSlice.reducer;

export const {
  selectAll: selectAllRegistrations,
  selectEntities: selectRegistrationEntities,
  selectIds: selectRegistrationIds,
} = legoAdapter.getSelectors((state: RootState) => state.registrations);
