import { Groups } from './ActionTypes';
import { callAPI } from '../util/http';

export function fetchGroup(groupId) {
  return callAPI({
    type: Groups.FETCH_GROUP,
    endpoint: `/groups/${groupId}/`
  });
}

export function fetchAll() {
  return callAPI({
    type: Groups.FETCH_ALL,
    endpoint: '/groups/'
  });
}
