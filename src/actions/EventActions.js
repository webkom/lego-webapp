import { Event } from './ActionTypes';
import { callAPI } from '🏠/utils/http';

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
