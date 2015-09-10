import { Events } from './ActionTypes';
import { callAPI } from '../http';

export function fetchAll() {
  return callAPI({
    type: Events.FETCH_ALL,
    endpoint: '/events'
  });
}
