import { Groups } from './ActionTypes';
import { callAPI } from '../utils/http';

export function fetchGroup(groupId) {
  return callAPI({
    type: Group.FETCH,
    endpoint: `/groups/${groupId}/`
  });
}

export function fetchAll() {
  return callAPI({
    type: Group.FETCH_ALL,
    endpoint: '/groups/'
  });
}
