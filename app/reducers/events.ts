import { createSlice } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import config from 'app/config';
import { eventSchema } from 'app/reducers';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { selectUserEntities } from 'app/reducers/users';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Event } from '../actions/ActionTypes';
import { selectPoolEntities } from './pools';
import {
  selectRegistrationEntities,
  selectRegistrationIds,
} from './registrations';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { DetailedEvent, UserDetailedEvent } from 'app/store/models/Event';
import type { AnyAction } from 'redux';

const legoAdapter = createLegoAdapter(EntityType.Events);

const eventsSlice = createSlice({
  name: EntityType.Events,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Event.FETCH, Event.FETCH_PREVIOUS, Event.FETCH_UPCOMING],
    deleteActions: [Event.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Events, addCase);

      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const events = normalize(action.payload, eventSchema).entities
          .events as DetailedEvent[];
        legoAdapter.upsertMany(state, events);
      });
      addCase(Event.SOCKET_REGISTRATION.SUCCESS, (state, action: AnyAction) => {
        const eventId = action.meta.eventId;
        const registration = action.payload;
        const stateEvent = state.entities[eventId] as DetailedEvent;

        if (!stateEvent) {
          return;
        }

        let registrationCount = stateEvent.registrationCount;
        let waitingRegistrations = stateEvent.waitingRegistrations;
        let waitingRegistrationCount = stateEvent.waitingRegistrationCount ?? 0;

        if (!registration.pool) {
          waitingRegistrationCount = waitingRegistrationCount + 1;

          if (waitingRegistrations) {
            waitingRegistrations = [...waitingRegistrations, registration.id];
          }
        } else {
          registrationCount++;
        }

        stateEvent.registrationCount = registrationCount;
        stateEvent.waitingRegistrationCount = waitingRegistrationCount;

        if (waitingRegistrations) {
          stateEvent.waitingRegistrations = waitingRegistrations;
        }
      });
      addCase(
        Event.SOCKET_UNREGISTRATION.SUCCESS,
        (state, action: AnyAction) => {
          const {
            eventId,
            activationTime: activationTimeFromMeta,
            fromPool,
            currentUser,
          } = action.meta;
          const stateEvent = state.entities[eventId] as DetailedEvent;
          const registration = action.payload;

          if (!stateEvent) {
            return;
          }

          const isCurrentUser =
            registration.user &&
            checkIfCurrentUser(registration.user.id, currentUser.id);

          if (isCurrentUser) {
            stateEvent.activationTime = activationTimeFromMeta;
          }

          if (fromPool) {
            stateEvent.registrationCount--;
          } else {
            stateEvent.waitingRegistrationCount--;
          }

          if (stateEvent.waitingRegistrations) {
            stateEvent.waitingRegistrations =
              stateEvent.waitingRegistrations.filter(
                (id) => id !== action.payload.id,
              );
          }

          stateEvent.following = false;
        },
      );
      addCase(Event.FOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.body.target] as
          | UserDetailedEvent
          | undefined;
        if (event) event.following = action.payload.id;
      });
      addCase(Event.UNFOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.eventId] as
          | UserDetailedEvent
          | undefined;
        if (event) event.following = false;
      });
      addCase(Event.FETCH_FOLLOWERS.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.eventId] as UserDetailedEvent;
        const followObj = action.payload.results.find(
          (follow) => follow.follower.id === action.meta.currentUserId,
        );
        event.following = followObj?.id;
      });
    },
  }),
});

export default eventsSlice.reducer;
export const {
  selectAllPaginated: selectAllEvents,
  selectEntities: selectEventEntities,
  selectIds: selectEventIds,
} = legoAdapter.getSelectors((state: RootState) => state.events);

function transformEvent(event: DetailedEvent) {
  return {
    ...event,
    startTime: event.startTime && moment(event.startTime).toISOString(),
    endTime: event.endTime && moment(event.endTime).toISOString(),
    activationTime:
      event.activationTime && moment(event.activationTime).toISOString(),
    mergeTime: event.mergeTime && moment(event.mergeTime).toISOString(),
    useCaptcha: config.environment === 'ci' ? false : event.useCaptcha,
  };
}

function transformRegistration(registration) {
  return {
    ...registration,
    registrationDate: moment(registration.registrationDate),
    unregistrationDate: moment(registration.unregistrationDate),
  };
}

export const selectEventById = createSelector(
  selectEventEntities,
  (_: RootState, props: { eventId: EntityId }) => props.eventId,
  (eventsById, eventId) => {
    const event = eventsById[eventId];

    if (event) {
      return transformEvent(event);
    }

    return {};
  },
);

export const selectEventBySlug = createSelector(
  selectEventEntities,
  (_: RootState, props: { eventSlug: string }) => props.eventSlug,
  (eventsById, eventSlug) => {
    const event = Object.values(eventsById).find(
      (event) => event.slug === eventSlug,
    );

    if (event) {
      return transformEvent(event);
    }

    return {};
  },
);

export const selectEventByIdOrSlug = createSelector(
  (state, props) => {
    const { eventIdOrSlug } = props;
    if (!isNaN(Number(eventIdOrSlug))) {
      return selectEventById(state, { eventId: eventIdOrSlug });
    }
    return selectEventBySlug(state, {
      eventSlug: eventIdOrSlug,
    });
  },
  (event) => event,
);

export const selectPoolsForEvent = createSelector(
  selectEventById,
  selectPoolEntities,
  (event, poolEntities) => {
    if (!event) return [];
    return (event.pools || []).map((poolId) => poolEntities[poolId]);
  },
);
export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  selectRegistrationEntities,
  selectUserEntities,
  (pools, registrationEntities, userEntities) =>
    pools.map((pool) => ({
      ...pool,
      registrations: orderBy(
        (pool.registrations || []).map((regId) => {
          const registration = registrationEntities[regId];
          return { ...registration, user: userEntities[registration.user] };
        }),
        'sharedMemberships',
        'desc',
      ),
    })),
);
export const selectMergedPool = createSelector(selectPoolsForEvent, (pools) => {
  if (pools.length === 0) return [];
  return [
    {
      name: 'Deltakere',
      ...pools.reduce(
        (total, pool) => {
          const capacity = total.capacity + pool.capacity;
          const permissionGroups = total.permissionGroups.concat(
            pool.permissionGroups,
          );
          const registrationCount =
            total.registrationCount + pool.registrationCount;
          return {
            capacity,
            permissionGroups,
            registrationCount,
          };
        },
        {
          capacity: 0,
          permissionGroups: [],
          registrationCount: 0,
        },
      ),
    },
  ];
});
export const selectMergedPoolWithRegistrations = createSelector(
  selectPoolsForEvent,
  selectRegistrationEntities,
  selectUserEntities,
  (pools, registrationEntities, userEntities) => {
    if (pools.length === 0) return [];
    return [
      {
        name: 'Deltakere',
        ...pools.reduce(
          (total, pool) => {
            const capacity = total.capacity + pool.capacity;
            const permissionGroups = total.permissionGroups.concat(
              pool.permissionGroups,
            );
            const registrations = total.registrations.concat(
              pool.registrations?.map((regId) => {
                const registration = registrationEntities[regId];
                return {
                  ...registration,
                  user: userEntities[registration.user],
                };
              }),
            );
            return {
              capacity,
              permissionGroups,
              registrations: orderBy(
                registrations,
                'sharedMemberships',
                'desc',
              ),
              registrationCount: registrations.length,
            };
          },
          {
            capacity: 0,
            permissionGroups: [],
            registrations: [],
            registrationCount: 0,
          },
        ),
      },
    ];
  },
);
export const selectAllRegistrationsForEvent = createSelector(
  selectRegistrationEntities,
  selectRegistrationIds,
  selectUserEntities,
  (_: RootState, props: { eventId: EntityId }) => props.eventId,
  (registrationEntities, registrationIds, usersById, eventId) =>
    registrationIds
      .map((regId) => registrationEntities[regId])
      .filter((registration) => registration.event === Number(eventId))
      .map((registration) => {
        const user = registration.user.id
          ? registration.user
          : usersById[registration.user];
        const createdBy =
          registration.createdBy !== null &&
          usersById[registration.createdBy] !== undefined
            ? usersById[registration.createdBy]
            : null;
        const updatedBy =
          registration.updatedBy !== null &&
          usersById[registration.createdBy] !== undefined
            ? usersById[registration.updatedBy]
            : null;
        return transformRegistration({
          ...registration,
          user,
          createdBy,
          updatedBy,
        });
      }),
);
export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById,
  selectRegistrationEntities,
  selectUserEntities,
  (event, registrationEntities, userEntities) => {
    if (!event) return [];
    return (event.waitingRegistrations || []).map((regId) => {
      const registration = registrationEntities[regId];
      return { ...registration, user: userEntities[registration.user] };
    });
  },
);
export const selectRegistrationForEventByUserId = createSelector(
  selectAllRegistrationsForEvent,
  (state, props) => props.userId,
  (registrations, userId) => {
    const userReg = registrations.filter((reg) => reg.user.id === userId);
    return userReg.length > 0 ? userReg[0] : null;
  },
);
export const selectCommentsForEvent = createSelector(
  selectEventById,
  selectCommentEntities,
  (event, commentEntities) => {
    if (!event) return [];
    return (event.comments || []).map(
      (commentId) => commentEntities[commentId],
    );
  },
);
export const selectRegistrationsFromPools = createSelector(
  selectPoolsWithRegistrationsForEvent,
  (pools) => {
    const registrationPools = pools.filter((pool) => pool.registrations);
    if (registrationPools.length === 0) return;
    return orderBy(
      registrationPools.flatMap((pool) => pool.registrations || []),
      'sharedMemberships',
      'desc',
    );
  },
);
export const getRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  (registrations) => {
    const grouped = groupBy(registrations, (obj) =>
      obj.unregistrationDate.isValid() ? 'unregistered' : 'registered',
    );
    const registered = (grouped['registered'] || []).sort((a, b) =>
      a.registrationDate.diff(b.registrationDate),
    );
    const unregistered = (grouped['unregistered'] || []).sort((a, b) =>
      a.unregistrationDate.diff(b.unregistrationDate),
    );
    return {
      registered,
      unregistered,
    };
  },
);
