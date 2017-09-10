// @flow

import moment from 'moment';
import { createSelector } from 'reselect';
import { Event } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';

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
        items: state.items.filter(id => id !== action.meta.id.toString())
      };
    }
    case Event.SOCKET_EVENT_UPDATED: {
      const events = normalize(action.payload, eventSchema).entities.events;
      return {
        ...state,
        byId: {
          ...state.byId,
          ...events
        }
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
      let waitingRegistrations = state.byId[eventId].waitingRegistrations;
      if (!action.payload.pool) {
        waitingRegistrations = [...waitingRegistrations, action.payload.id];
      }
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...state.byId[eventId],
            loading: false,
            waitingRegistrations
          }
        }
      };
    }
    case Event.SOCKET_UNREGISTRATION.SUCCESS: {
      const { eventId, activationTime } = action.meta;
      return {
        ...state,
        byId: {
          ...state.byId,
          [eventId]: {
            ...state.byId[eventId],
            loading: false,
            activationTime,
            waitingRegistrations: state.byId[
              eventId
            ].waitingRegistrations.filter(id => id !== action.payload.id)
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
    fetch: Event.FETCH,
    mutate: Event.CREATE
  },
  mutate
});

function transformEvent(event) {
  return {
    ...event,
    startTime: moment(event.startTime),
    endTime: moment(event.endTime)
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
  (pools, registrationsById) =>
    pools.map(pool => ({
      ...pool,
      registrations: pool.registrations.map(regId => registrationsById[regId])
    }))
);

export const selectAllRegistrationsForEvent = createSelector(
  state => state.registrations.byId,
  state => state.registrations.items,
  (state, props) => props.eventId,
  (registrationsById, registrationItems, eventId) =>
    registrationItems
      .map((regId, i) => transformRegistration(registrationsById[regId]))
      .filter(reg => reg.event == eventId)
);

export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById,
  state => state.registrations.byId,
  (event, registrationsById) => {
    if (!event) return [];
    return (event.waitingRegistrations || [])
      .map(regId => registrationsById[regId]);
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
