import { arrayOf } from 'normalizr';
import { groupSchema } from 'app/reducers';
import { Group } from './ActionTypes';
import { callAPI } from 'app/utils/http';

export function fetchGroup(groupId) {
  return callAPI({
    types: [Group.FETCH_BEGIN, Group.FETCH_SUCCESS, Group.FETCH_FAILURE],
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Fetching group failed'
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: [Group.FETCH_ALL_BEGIN, Group.FETCH_ALL_SUCCESS, Group.FETCH_ALL_FAILURE],
    endpoint: '/groups/',
    schema: arrayOf(groupSchema),
    meta: {
      errorMessage: 'Fetching groups failed'
    }
  });
}

export function updateGroup({ groupId, updates }) {
  return callAPI({
    types: [Group.UPDATE_BEGIN, Group.UPDATE_SUCCESS, Group.UPDATE_FAILURE],
    endpoint: `/groups/${groupId}/`,
    method: 'patch',
    body: updates,
    schema: groupSchema,
    meta: {
      errorMessage: 'Updating group failed'
    }
  });
}
