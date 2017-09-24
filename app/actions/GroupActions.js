// @flow

import { groupSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group } from './ActionTypes';

type AddMemberArgs = {
  groupId: number,
  userId: number
};

export function addMember({ groupId, userId }: AddMemberArgs) {
  return callAPI({
    types: Group.ADD_MEMBER,
    endpoint: `/memberships`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Innmelding av bruker feilet'
    }
  });
}

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

export function updateGroup({
  groupId,
  updates
}: {
  groupId: number,
  updates: Array<Object>
}) {
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
