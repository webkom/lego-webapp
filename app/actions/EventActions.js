import { arrayOf } from 'normalizr';
import { Event } from './ActionTypes';
import { eventSchema } from 'app/reducers';
import { callAPI, createQueryString } from 'app/utils/http';

export function fetchEvent(eventId) {
  return callAPI({
    types: [
      Event.FETCH_BEGIN,
      Event.FETCH_SUCCESS,
      Event.FETCH_FAILURE
    ],
    endpoint: `/events/${eventId}/`,
    schema: eventSchema
  });
}

export function fetchAll({ year, month } = {}) {
  return callAPI({
    types: [
      Event.FETCH_BEGIN,
      Event.FETCH_SUCCESS,
      Event.FETCH_FAILURE
    ],
    endpoint: `/events/${createQueryString({ year, month })}`,
    schema: arrayOf(eventSchema)
  });
}
