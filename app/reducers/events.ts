import { produce } from 'immer';
import { groupBy, orderBy, without } from 'lodash';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import config from 'app/config';
import { eventSchema } from 'app/reducers';
import { mutateComments, selectCommentEntities } from 'app/reducers/comments';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';
import { Event } from '../actions/ActionTypes';
import type { DetailedEvent } from 'app/store/models/Event';

type State = any;
const mutateEvent = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Event.FETCH_PREVIOUS.SUCCESS:
      for (const eventId in action.payload.entities.events) {
        const event = action.payload.entities.events[eventId];
        newState.byId[eventId] = produce(event, (e): void => {
          e.isUsersUpcoming = false;
        });
      }

      break;

    case Event.FETCH_UPCOMING.SUCCESS:
      for (const eventId in action.payload.entities.events) {
        const event = action.payload.entities.events[eventId];
        newState.byId[eventId] = produce(event, (e): void => {
          e.isUsersUpcoming = true;
        });
      }

      break;

    case Event.DELETE.SUCCESS:
      newState.items = without(newState.items, action.meta.id);
      break;

    case Event.SOCKET_EVENT_UPDATED: {
      const events = normalize(action.payload, eventSchema).entities.events;
      newState.byId = mergeObjects(newState.byId, events);
      break;
    }

    case Event.CLEAR:
      newState.items = [];
      newState.pagination = {};
      break;

    case Event.REQUEST_REGISTER.BEGIN:
      newState.byId[action.meta.id].loading = true;
      break;

    case Event.SOCKET_REGISTRATION.SUCCESS: {
      const eventId = action.meta.eventId;
      const registration = action.payload;
      const stateEvent = newState.byId[eventId];

      if (!stateEvent) {
        return;
      }

      let registrationCount = stateEvent.registrationCount;
      let waitingRegistrations = stateEvent.waitingRegistrations;
      let waitingRegistrationCount = stateEvent.waitingRegistrationCount;

      if (!registration.pool) {
        waitingRegistrationCount = waitingRegistrationCount + 1;

        if (waitingRegistrations) {
          waitingRegistrations = [...waitingRegistrations, registration.id];
        }
      } else {
        registrationCount++;
      }

      stateEvent.loading = false;
      stateEvent.registrationCount = registrationCount;
      stateEvent.waitingRegistrationCount = waitingRegistrationCount;

      if (waitingRegistrations) {
        stateEvent.waitingRegistrations = waitingRegistrations;
      }

      break;
    }

    case Event.SOCKET_UNREGISTRATION.SUCCESS: {
      const {
        eventId,
        activationTime: activationTimeFromMeta,
        fromPool,
        currentUser,
      } = action.meta;
      const stateEvent = newState.byId[eventId];
      const registration = action.payload;

      if (!stateEvent) {
        return;
      }

      const isCurrentUser =
        registration.user &&
        checkIfCurrentUser(registration.user.id, currentUser.id);
      stateEvent.loading = false;

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
            (id) => id !== action.payload.id
          );
      }

      break;
    }

    case Event.SOCKET_REGISTRATION.FAILURE:
      if (newState.byId[action.meta.eventId]) {
        newState.byId[action.meta.eventId].loading = false;
      }

      break;

    case Event.REQUEST_REGISTER.FAILURE:
      if (newState.byId[action.meta.id]) {
        newState.byId[action.meta.id].loading = false;
      }

      break;

    case Event.FOLLOW.SUCCESS:
      if (newState.byId[action.meta.body.target]) {
        newState.byId[action.meta.body.target].following =
          action.payload.result;
      }
      break;

    case Event.UNFOLLOW.SUCCESS:
      if (newState.byId[action.meta.eventId]) {
        newState.byId[action.meta.eventId].following = false;
      }
      break;

    default:
      break;
  }
});
const mutate = joinReducers(mutateComments('events'), mutateEvent);
export default createEntityReducer<'events'>({
  key: 'events',
  types: {
    fetch: [Event.FETCH, Event.FETCH_PREVIOUS, Event.FETCH_UPCOMING],
    delete: Event.DELETE,
  },
  mutate,
});

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

export const selectEvents = createSelector(
  (state) => state.events.byId,
  (state) => state.events.items,
  (eventsById, eventIds) =>
    eventIds.map((id) => transformEvent(eventsById[id])) as ReadonlyArray<
      ReturnType<typeof transformEvent>
    >
);
export const selectPreviousEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.isUsersUpcoming === false)
);
export const selectUpcomingEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.isUsersUpcoming)
);
export const selectSortedEvents = createSelector(selectEvents, (events) =>
  [...events].sort(
    (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix()
  )
);

export const selectEventById = createSelector(
  (state) => state.events.byId,
  (state, props) => props.eventId,
  (eventsById, eventId) => {
    const event = eventsById[eventId];

    if (event) {
      return transformEvent(event);
    }

    return {};
  }
);

export const selectEventBySlug = createSelector(
  (state) => state.events.byId,
  (state, props) => props.eventSlug,
  (eventsById, eventSlug) => {
    const event = Object.values(eventsById).find(
      (event) => event.slug === eventSlug
    );

    if (event) {
      return transformEvent(event);
    }

    return {};
  }
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
  (event) => event
);

export const selectPoolsForEvent = createSelector(
  selectEventById,
  (state) => state.pools.byId,
  (event, poolsById) => {
    if (!event) return [];
    return (event.pools || []).map((poolId) => poolsById[poolId]);
  }
);
export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  (state) => state.registrations.byId,
  (state) => state.users.byId,
  (pools, registrationsById, usersById) =>
    pools.map((pool) => ({
      ...pool,
      registrations: orderBy(
        (pool.registrations || []).map((regId) => {
          const registration = registrationsById[regId];
          return { ...registration, user: usersById[registration.user] };
        }),
        'sharedMemberships',
        'desc'
      ),
    }))
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
            pool.permissionGroups
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
        }
      ),
    },
  ];
});
export const selectMergedPoolWithRegistrations = createSelector(
  selectPoolsForEvent,
  (state) => state.registrations.byId,
  (state) => state.users.byId,
  (pools, registrationsById, usersById) => {
    if (pools.length === 0) return [];
    return [
      {
        name: 'Deltakere',
        ...pools.reduce(
          (total, pool) => {
            const capacity = total.capacity + pool.capacity;
            const permissionGroups = total.permissionGroups.concat(
              pool.permissionGroups
            );
            const registrations = total.registrations.concat(
              pool.registrations?.map((regId) => {
                const registration = registrationsById[regId];
                return { ...registration, user: usersById[registration.user] };
              })
            );
            return {
              capacity,
              permissionGroups,
              registrations: orderBy(
                registrations,
                'sharedMemberships',
                'desc'
              ),
              registrationCount: registrations.length,
            };
          },
          {
            capacity: 0,
            permissionGroups: [],
            registrations: [],
            registrationCount: 0,
          }
        ),
      },
    ];
  }
);
export const selectAllRegistrationsForEvent = createSelector(
  (state) => state.registrations.byId,
  (state) => state.registrations.items,
  (state) => state.users.byId,
  (state, props) => props.eventId,
  (registrationsById, registrationItems, usersById, eventId) =>
    registrationItems
      .map((regId) => registrationsById[regId])
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
      })
);
export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById,
  (state) => state.registrations.byId,
  (state) => state.users.byId,
  (event, registrationsById, usersById) => {
    if (!event) return [];
    return (event.waitingRegistrations || []).map((regId) => {
      const registration = registrationsById[regId];
      return { ...registration, user: usersById[registration.user] };
    });
  }
);
export const selectRegistrationForEventByUserId = createSelector(
  selectAllRegistrationsForEvent,
  (state, props) => props.userId,
  (registrations, userId) => {
    const userReg = registrations.filter((reg) => reg.user.id === userId);
    return userReg.length > 0 ? userReg[0] : null;
  }
);
export const selectCommentsForEvent = createSelector(
  selectEventById,
  selectCommentEntities,
  (event, commentEntities) => {
    if (!event) return [];
    return (event.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
export const selectRegistrationsFromPools = createSelector(
  selectPoolsWithRegistrationsForEvent,
  (pools) =>
    orderBy(
      // $FlowFixMe
      pools.flatMap((pool) => pool.registrations || []),
      'sharedMemberships',
      'desc'
    )
);
export const getRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  (registrations) => {
    const grouped = groupBy(registrations, (obj) =>
      obj.unregistrationDate.isValid() ? 'unregistered' : 'registered'
    );
    const registered = (grouped['registered'] || []).sort((a, b) =>
      a.registrationDate.diff(b.registrationDate)
    );
    const unregistered = (grouped['unregistered'] || []).sort((a, b) =>
      a.unregistrationDate.diff(b.unregistrationDate)
    );
    return {
      registered,
      unregistered,
    };
  }
);
