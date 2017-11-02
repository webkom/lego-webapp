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
import { groupBy } from 'lodash';

export type EventEntity = {
  id: number,
  name: string,
  comments: Array<number>
};

function mutateEvent(state: any, action: any) {
  switch (action.type) {
    case Event.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
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
    case Event.REGISTER.BEGIN: {
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
      let waitingRegistrations = stateEvent.waitingRegistrations || [];
      if (!registration.pool) {
        waitingRegistrations = [...waitingRegistrations, registration.id];
      }
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...stateEvent,
            loading: false,
            registrationCount: registration.pool
              ? stateEvent.registrationCount + 1
              : stateEvent.registrationCount,
            waitingRegistrations
          }
        }
      };
    }
    case Event.SOCKET_UNREGISTRATION.SUCCESS: {
      const { eventId, activationTime, fromPool } = action.meta;
      const stateEvent = state.byId[eventId];
      if (!stateEvent) {
        return state;
      }
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
            waitingRegistrations: (stateEvent.waitingRegistrations || []
            ).filter(id => id !== action.payload.id)
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
    case Event.REGISTER.FAILURE: {
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
    fetch: Event.FETCH
  },
  mutate
});

function transformEvent(event) {
  return {
    ...event,
    startTime: moment(event.startTime),
    endTime: moment(event.endTime),
    mergeTime: moment(event.mergeTime)
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

export const selectSortedEvents = createSelector(selectEvents, events =>
  events.sort((a, b) => a.startTime - b.startTime)
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
      registrations: pool.registrations.map(regId => {
        const registration = registrationsById[regId];
        return {
          ...registration,
          user: usersById[registration.user]
        };
      })
    }))
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
              registrations
            };
          },
          { capacity: 0, permissionGroups: [], registrations: [] }
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
        return transformRegistration({
          ...registration,
          user: usersById[registration.user]
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
  pools => pools.reduce((users, pool) => users.concat(pool.registrations), [])
);

export const getRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  registrations => {
    const grouped = groupBy(
      registrations,
      obj => (obj.unregistrationDate.isValid() ? 'unregistered' : 'registered')
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
