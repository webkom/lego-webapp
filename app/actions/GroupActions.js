// @flow

import type { Thunk } from 'app/types';
import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group, Membership } from './ActionTypes';
import { get } from 'lodash';

export type AddMemberArgs = {
  groupId: number,
  userId: number,
  role: string,
};

export function addMember({ groupId, userId, role }: AddMemberArgs) {
  return callAPI({
    types: Membership.CREATE,
    endpoint: `/groups/${groupId}/memberships/`,
    method: 'POST',
    body: {
      user: userId,
      role,
    },
    schema: membershipSchema,
    meta: {
      groupId,
      errorMessage: 'Innmelding av bruker feilet',
      successMessage: 'Brukeren ble innmeldt',
    },
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
      errorMessage: 'Utmelding av bruker feilet',
    },
  });
}

export function fetchGroup(groupId: number) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Henting av gruppe feilet',
    },
    propagateError: true,
  });
}

export function fetchAll() {
  return callAPI({
    types: Group.FETCH,
    endpoint: '/groups/',
    schema: [groupSchema],
    meta: {
      errorMessage: 'Henting av grupper feilet',
    },
    propagateError: true,
  });
}

export function fetchAllWithType(type: string) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/?type=${type}`,
    schema: [groupSchema],
    meta: {
      errorMessage: 'Henting av grupper feilet',
    },
    propagateError: true,
  });
}

export function editGroup(group: Object): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Group.UPDATE,
        endpoint: `/groups/${group.id}/`,
        schema: groupSchema,
        method: 'PATCH',
        body: group,
        meta: {
          group,
          errorMessage: 'Oppdatering av gruppe feilet',
          successMessage: 'Oppdatering av gruppe fullført',
        },
      })
    );
  };
}

export function joinGroup(
  groupId: number,
  user: Object,
  role: string = 'member'
): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Membership.JOIN_GROUP,
        endpoint: '/memberships/',
        schema: membershipSchema,
        method: 'POST',
        body: {
          abakus_group: groupId,
          user: user.id,
          role,
        },
        meta: {
          errorMessage: 'Registrering i gruppe feilet',
          successMessage: 'Registrering i gruppe fullført',
          groupId: groupId,
          username: user.username,
        },
      })
    );
  };
}

export function leaveGroup(membership: Object): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Membership.LEAVE_GROUP,
        endpoint: `/memberships/${membership.id}/`,
        method: 'DELETE',
        meta: {
          id: membership.id,
          username: membership.user.username,
          groupId: membership.abakusGroup,
          errorMessage: 'Avregistrering fra gruppe feilet',
          successMessage: 'Avregistrering fra gruppe fullført',
        },
      })
    );
  };
}

export function fetchAllMemberships(
  groupId: number,
  descendants: boolean = false
): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      fetchMembershipsPagination({ descendants, groupId, next: true })
    ).then(
      (res) =>
        res.payload.next && dispatch(fetchAllMemberships(groupId, descendants))
    );
  };
}

export function fetchMemberships(
  groupId: number,
  descendants: boolean = false
): Thunk<*> {
  return fetchMembershipsPagination({ groupId, next: true, descendants });
}

export function fetchMembershipsPagination({
  groupId,
  next,
  descendants = false,
}: {
  groupId: number,
  next: boolean,
  descendants?: boolean,
}): Thunk<*> {
  return (dispatch, getState) => {
    return dispatch(
      callAPI({
        types: Group.MEMBERSHIP_FETCH,
        endpoint: `/groups/${groupId}/memberships/`,
        schema: [membershipSchema],
        useCache: false,
        query: next
          ? {
              ...get(getState(), [
                'memberships',
                'pagination',
                groupId.toString(),
                'next',
              ]),
              descendants,
            }
          : { descendants },
        meta: {
          groupId: groupId,
          errorMessage: 'Henting av medlemmene for gruppen feilet',
          paginationKey: groupId,
        },
        propagateError: true,
      })
    );
  };
}
