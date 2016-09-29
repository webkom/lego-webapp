// @flow

import { createSelector } from 'reselect';
import { Event } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

export type EventEntity = {
  id: number;
  name: string;
  comments: Array<number>;
};

const mutate = mutateComments('events');

export default createEntityReducer({
  key: 'events',
  types: {
    fetch: Event.FETCH
  },
  mutate
});

export const selectEvents = createSelector(
  (state) => state.events.byId,
  (state) => state.events.items,
  (eventsById, eventIds) => eventIds.map((id) => eventsById[id])
);

export const selectEventById = createSelector(
  (state) => state.events.byId,
  (state, props) => props.eventId,
  (eventsById, eventId) => eventsById[eventId]
);

export const selectCommentsForEvent = createSelector(
  selectEventById,
  (state) => state.comments.byId,
  (event, commentsById) => {
    if (!event) return [];
    return (event.comments || []).map((commentId) => commentsById[commentId]);
  }
);
