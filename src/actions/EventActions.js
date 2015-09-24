import { Events } from './ActionTypes';
import { callAPI } from '../util/http';

export function fetchAll() {
  return callAPI({
    type: Events.FETCH_ALL,
    endpoint: '/events/'
  });
}
