// @flow

import type { Thunk } from 'app/types';
import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group, Membership } from './ActionTypes';
import { push } from 'react-router-redux';
import { omit } from 'lodash';

export type AddMemberArgs = {
  groupId: number,
  userId: number,
  role: string
};

export function addMember({ groupId, userId, role }: AddMemberArgs) {
  return callAPI({
    types: Membership.CREATE,
    endpoint: `/groups/${groupId}/memberships/`,
    method: 'POST',
    body: {
      user: userId,
      role
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
    endpoint: `/groups/${membership.abakusGroup}/memberships/${membership.id}/`,
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

export function fetchAllWithType(type: string) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/?type=${type}`,
    schema: [groupSchema],
    meta: {
      errorMessage: 'Henting av grupper feilet'
    },
    propagateError: true
  });
}

export function updateGroup(group: Object) {
  return callAPI({
    types: Group.UPDATE,
    endpoint: `/groups/${group.id}/`,
    method: 'PATCH',
    body: {
      ...group
    },
    schema: groupSchema,
    meta: {
      errorMessage: 'Oppdatering av grupper feilet'
    }
  });
}

export function editGroup(group: Object): Thunk<*> {
  const { id } = group;
  return dispatch => {
    return dispatch(
      callAPI({
        types: Group.UPDATE,
        endpoint: `/groups/${id}/`,
        schema: groupSchema,
        method: 'PATCH',
        body: group.logo ? group : omit(group, 'logo'),
        meta: {
          group,
          errorMessage: 'Editing group failed'
        }
      })
    );
  };
}

export function joinGroup(
  groupId: number,
  user: Object,
  role: string = 'member'
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Membership.JOIN_GROUP,
        endpoint: '/memberships/',
        schema: membershipSchema,
        method: 'POST',
        body: {
          abakus_group: groupId,
          user: user.id,
          role
        },
        meta: {
          errorMessage: 'Joining the interest group failed.',
          groupId: groupId,
          username: user.username
        }
      })
    );
  };
}

export function leaveGroup(membership: Object): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Membership.LEAVE_GROUP,
        endpoint: `/memberships/${membership.id}/`,
        method: 'DELETE',
        meta: {
          id: membership.id,
          username: membership.user.username,
          groupId: membership.abakusGroup,
          errorMessage: 'Leaving the interest group failed.'
        }
      })
    );
  };
}

export function fetchMemberships(groupId: number) {
  return callAPI({
    types: Group.MEMBERSHIP_FETCH,
    endpoint: `/groups/${groupId}/memberships/`,
    schema: [membershipSchema],
    useCache: false,
    meta: {
      groupId: groupId,
      errorMessage: 'Henting av medlemmene for gruppen feilet'
    },
    propagateError: true
  });
}
