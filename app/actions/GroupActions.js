// @flow

import { groupSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group } from './ActionTypes';

export function fetchGroup(groupId: number) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Fetching group failed'
    },
    propagateError: true
  });
}

export function fetchAll() {
  return callAPI({
    types: Group.FETCH,
    endpoint: '/groups/',
    schema: [groupSchema],
    meta: {
      errorMessage: 'Fetching groups failed'
    },
    propagateError: true
  });
}

export function updateGroup({ groupId, updates }: { groupId: number, updates: Array<Object> }) {
  return callAPI({
    types: Group.UPDATE,
    endpoint: `/groups/${groupId}/`,
    method: 'PATCH',
    body: updates,
    schema: groupSchema,
    meta: {
      errorMessage: 'Updating group failed'
    }
  });
}
