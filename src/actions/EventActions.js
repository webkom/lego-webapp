import { Events } from './ActionTypes';
import { callAPI } from '../util/http';

export function fetchEvent(eventId) {
  return callAPI({
    type: Events.FETCH_EVENT,
    endpoint: `/events/${eventId}/`
  });
}

export function fetchAll() {
  return callAPI({
    type: Events.FETCH_ALL,
    endpoint: '/events/'
  });
}
