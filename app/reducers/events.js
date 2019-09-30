// @flow

import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Event } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import { groupBy, orderBy } from 'lodash';

export type EventEntity = {
  id: number,
  title: string,
  comments: Array<number>
};

function mutateEvent(state: any, action: any) {
  switch (action.type) {
    case Event.FETCH_PREVIOUS.SUCCESS: {
      const events = action.payload.result.reduce(
        (total, id) => ({
          ...total,
          [id]: {
            ...action.payload.entities.events[id],
            isUsersUpcoming: false
          }
        }),
        {}
      );
      return {
        ...state,
        byId: mergeObjects(state.byId, events)
      };
    }
    case Event.FETCH_UPCOMING.SUCCESS: {
      const events = action.payload.result.reduce(
        (total, id) => ({
          ...total,
          [id]: {
            ...action.payload.entities.events[id],
            isUsersUpcoming: true
          }
        }),
        {}
      );
      return {
        ...state,
        byId: mergeObjects(state.byId, events)
      };
    }
    case Event.SOCKET_EVENT_UPDATED: {
      const events = normalize(action.payload, eventSchema).entities.events;
      return {
        ...state,
        byId: mergeObjects(state.byId, events)
      };
    }
    case Event.CLEAR: {
      return {
        ...state,
        items: [],
        pagination: {}
      };
    }
    case Event.REQUEST_REGISTER.BEGIN: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.meta.id]: {
            ...state.byId[action.meta.id],
            loading: true
          }
        }
      };
    }
    case Event.SOCKET_REGISTRATION.SUCCESS: {
      const eventId = action.meta.eventId;
      const registration = action.payload;
      const stateEvent = state.byId[eventId];
      if (!stateEvent) {
        return state;
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
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...stateEvent,
            loading: false,
            registrationCount,
            ...(waitingRegistrations && { waitingRegistrations }),
            waitingRegistrationCount
          }
        }
      };
    }
    case Event.SOCKET_UNREGISTRATION.SUCCESS: {
      const {
        eventId,
        activationTime: activationTimeFromMeta,
        fromPool,
        currentUser
      } = action.meta;
      const stateEvent = state.byId[eventId];
      const registration = action.payload;
      if (!stateEvent) {
        return state;
      }
      const isMe = registration.user.id === currentUser.id;
      const activationTime = isMe
        ? activationTimeFromMeta
        : stateEvent.activationTime;
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...stateEvent,
            loading: false,
            activationTime,
            registrationCount: fromPool
              ? stateEvent.registrationCount - 1
              : stateEvent.registrationCount,
            waitingRegistrationCount: fromPool
              ? stateEvent.waitingRegistrationCount
              : stateEvent.waitingRegistrationCount - 1,
            ...(stateEvent.waitingRegistrations && {
              waitingRegistrations: stateEvent.waitingRegistrations.filter(
                id => id !== registration.id
              )
            }),
            isUserFollowing: isMe
              ? undefined
              : state.byId[eventId].isUserFollowing
          }
        }
      };
    }
    case Event.SOCKET_REGISTRATION.FAILURE: {
      const { eventId } = action.meta;
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...state.byId[eventId],
            loading: false
          }
        }
      };
    }
    case Event.REQUEST_REGISTER.FAILURE: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.meta.id]: {
            ...state.byId[action.meta.id],
            loading: false
          }
        }
      };
    }
    case Event.FOLLOW.SUCCESS: {
      const eventId = action.payload.target;
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...state.byId[eventId],
            isUserFollowing: action.payload
          }
        }
      };
    }
    case Event.UNFOLLOW.SUCCESS: {
      const eventId = action.meta.eventId;
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...state.byId[eventId],
            isUserFollowing: undefined
          }
        }
      };
    }
    case Event.IS_USER_FOLLOWING.SUCCESS: {
      // NOTE: assume we've only asked for a single event.
      if (action.payload.length > 0) {
        const eventId = action.payload[0].target;
        return {
          ...state,
          byId: {
            ...state.byId,
            [eventId]: {
              ...state.byId[eventId],
              isUserFollowing: action.payload[0]
            }
          }
        };
      } else {
        // leave undefined to be false.
        return state;
      }
    }
    default:
      return state;
  }
}

const mutate = joinReducers(mutateComments('events'), mutateEvent);

export default createEntityReducer({
  key: 'events',
  types: {
    fetch: [Event.FETCH, Event.FETCH_PREVIOUS, Event.FETCH_UPCOMING],
    delete: Event.DELETE
  },
  mutate
});

function transformEvent(event) {
  return {
    ...event,
    startTime: moment(event.startTime),
    endTime: moment(event.endTime),
    activationTime:
      event.activationTime !== null ? moment(event.activationTime) : null,
    mergeTime: event.mergeTime && moment(event.mergeTime)
  };
}

function transformRegistration(registration) {
  return {
    ...registration,
    registrationDate: moment(registration.registrationDate),
    unregistrationDate: moment(registration.unregistrationDate)
  };
}

export const selectEvents = createSelector(
  state => state.events.byId,
  state => state.events.items,
  (eventsById, eventIds) => eventIds.map(id => transformEvent(eventsById[id]))
);

export const selectPreviousEvents = createSelector(
  selectEvents,
  events => events.filter(event => event.isUsersUpcoming === false)
);

export const selectUpcomingEvents = createSelector(
  selectEvents,
  events => events.filter(event => event.isUsersUpcoming)
);

export const selectSortedEvents = createSelector(
  selectEvents,
  events => events.sort((a, b) => a.startTime - b.startTime)
);

export const selectEventById = createSelector(
  state => state.events.byId,
  (state, props) => props.eventId,
  (eventsById, eventId) => {
    const event = eventsById[eventId];

    if (event) {
      return transformEvent(event);
    }
    return {};
  }
);

export const selectPoolsForEvent = createSelector(
  selectEventById,
  state => state.pools.byId,
  (event, poolsById) => {
    if (!event) return [];
    return (event.pools || []).map(poolId => poolsById[poolId]);
  }
);
export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  state => state.registrations.byId,
  state => state.users.byId,
  (pools, registrationsById, usersById) =>
    pools.map(pool => ({
      ...pool,
      registrations: orderBy(
        (pool.registrations || []).map(regId => {
          const registration = registrationsById[regId];
          return {
            ...registration,
            user: usersById[registration.user]
          };
        }),
        'sharedMemberships',
        'desc'
      )
    }))
);

export const selectMergedPool = createSelector(
  selectPoolsForEvent,
  pools => {
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
              registrationCount
            };
          },
          { capacity: 0, permissionGroups: [], registrationCount: 0 }
        )
      }
    ];
  }
);

export const selectMergedPoolWithRegistrations = createSelector(
  selectPoolsForEvent,
  state => state.registrations.byId,
  state => state.users.byId,
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
              pool.registrations.map(regId => {
                const registration = registrationsById[regId];
                return {
                  ...registration,
                  user: usersById[registration.user]
                };
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
              registrationCount: registrations.length
            };
          },
          {
            capacity: 0,
            permissionGroups: [],
            registrations: [],
            registrationCount: 0
          }
        )
      }
    ];
  }
);

export const selectAllRegistrationsForEvent = createSelector(
  state => state.registrations.byId,
  state => state.registrations.items,
  state => state.users.byId,
  (state, props) => props.eventId,
  (registrationsById, registrationItems, usersById, eventId) =>
    registrationItems
      .map((regId, i) => {
        const registration = registrationsById[regId];
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
          updatedBy
        });
      })
      .filter(reg => reg.event == eventId)
);

export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById,
  state => state.registrations.byId,
  state => state.users.byId,
  (event, registrationsById, usersById) => {
    if (!event) return [];
    return (event.waitingRegistrations || []).map(regId => {
      const registration = registrationsById[regId];
      return {
        ...registration,
        user: usersById[registration.user]
      };
    });
  }
);

export const selectCommentsForEvent = createSelector(
  selectEventById,
  state => state.comments.byId,
  (event, commentsById) => {
    if (!event) return [];
    return (event.comments || []).map(commentId => commentsById[commentId]);
  }
);

export const selectRegistrationsFromPools = createSelector(
  selectPoolsWithRegistrationsForEvent,
  pools =>
    orderBy(
      // $FlowFixMe
      pools.flatMap(pool => pool.registrations || []),
      'sharedMemberships',
      'desc'
    )
);

export const getRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  registrations => {
    const grouped = groupBy(registrations, obj =>
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
      unregistered
    };
  }
);
