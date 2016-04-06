import { Event } from './ActionTypes';
import { callAPI } from 'app/utils/http';

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

export function fetchAll() {
  return callAPI({
    types: [
      Event.FETCH_ALL_BEGIN,
      Event.FETCH_ALL_SUCCESS,
      Event.FETCH_ALL_FAILURE
    ],
    endpoint: '/events/'
  });
}
