// @flow

import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group, Membership } from './ActionTypes';

export type AddMemberArgs = {
  groupId: number,
  userId: number,
  role: string
};

export function addMember({ groupId, userId, role }: AddMemberArgs) {
  return callAPI({
    types: Membership.CREATE,
    endpoint: '/memberships/',
    method: 'POST',
    body: {
      role,
      user: userId,
      abakusGroup: groupId
    },
    schema: membershipSchema,
    meta: {
      groupId,
      errorMessage: 'Innmelding av bruker feilet'
    }
  });
}

export function removeMember(membership: Object) {
  return callAPI({
    types: Membership.REMOVE,
    endpoint: `/memberships/${membership.id}/`,
    method: 'DELETE',
    schema: membershipSchema,
    meta: {
      id: membership.id,
      groupId: membership.abakusGroup,
      errorMessage: 'Utmelding av bruker feilet'
    }
  });
}

export function fetchGroup(groupId: number) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Henting av gruppe feilet'
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
      errorMessage: 'Henting av grupper feilet'
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
      errorMessage: 'Oppdatering av grupper feilet'
    }
  });
}
