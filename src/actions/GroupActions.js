import { Group } from './ActionTypes';
import { callAPI, patch } from '../utils/http';

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

export function updateGroup({ groupId, updates }) {
  return callAPI({
    type: Group.UPDATE,
    endpoint: `/groups/${groupId}/`,
    method: 'patch',
    body: updates
  });
}
