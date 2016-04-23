import { Event } from './ActionTypes';
import { callAPI, createQueryString } from 'app/utils/http';

export function fetchEvent(eventId) {
  return callAPI({
    types: [
      Event.FETCH_BEGIN,
      Event.FETCH_SUCCESS,
      Event.FETCH_FAILURE
    ],
    endpoint: `/events/${eventId}/`
  });
}

export function fetchAll({ year, month } = {}) {
  return callAPI({
    types: [
      Event.FETCH_ALL_BEGIN,
      Event.FETCH_ALL_SUCCESS,
      Event.FETCH_ALL_FAILURE
    ],
    endpoint: `/events/${createQueryString({ year, month })}`
  });
}
