// @flow

import { groupSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group } from './ActionTypes';
import isRequestNeeded from 'app/utils/isRequestNeeded';

const reducerKey = 'groups';

export function fetchGroup(groupId) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Fetching group failed'
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: Group.FETCH,
    endpoint: '/groups/',
    schema: [groupSchema],
    meta: {
      errorMessage: 'Fetching groups failed'
    }
  });
}

export function updateGroup({ groupId, updates }) {
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
