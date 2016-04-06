import { Event } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function fetchEvent(eventId) {
  return callAPI({
    type: Event.FETCH,
    endpoint: `/events/${eventId}/`
  });
}

export function fetchAll() {
  return callAPI({
    type: Event.FETCH_ALL,
    endpoint: '/events/'
  });
}
