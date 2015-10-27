import { Groups } from './ActionTypes';
import { callAPI } from '../util/http';

// export function fetchEvent(eventId) {
//   return callAPI({
//     type: Groups.FETCH,
//     endpoint: `/events/${eventId}/`
//   });
// }

export function fetchAll() {
  return callAPI({
    type: Groups.FETCH_ALL,
    endpoint: '/groups/'
  });
}
