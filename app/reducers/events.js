// @flow

import moment from 'moment';
import { createSelector } from 'reselect';
import { Event } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';

export type EventEntity = {
  id: number;
  name: string;
  comments: Array<number>;
};

function mutateEvent(state: any, action: any) {
  switch (action.type) {
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
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.meta.eventId]: {
            ...state.byId[action.meta.eventId],
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
    endTime: moment(event.endTime)
  };
}

export const selectEvents = createSelector(
  (state) => state.events.byId,
  (state) => state.events.items,
  (eventsById, eventIds) => eventIds.map((id) => transformEvent(eventsById[id]))
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

export const selectPoolsForEvent = createSelector(
  selectEventById,
  (state) => state.pools.byId,
  (event, poolsById) => {
    if (!event) return [];
    return (event.pools || []).map((poolId) => (poolsById[poolId]));
  }
);

export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  (state) => state.registrations.byId,
  (pools, registrationsById) => (
    pools.map((pool) => ({
      ...pool,
      registrations: pool.registrations.map((regId) => registrationsById[regId])
    }))
  )
);

export const selectCommentsForEvent = createSelector(
  selectEventById,
  (state) => state.comments.byId,
  (event, commentsById) => {
    if (!event) return [];
    return (event.comments || []).map((commentId) => commentsById[commentId]);
  }
);
