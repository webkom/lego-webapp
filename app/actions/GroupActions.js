// @flow

import type { Thunk } from 'app/types';
import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Group, Membership } from './ActionTypes';
import { push } from 'connected-react-router';

export type AddMemberArgs = {
  groupId: number,
  userId: number,
  role: string,
};

export function addMember({
  groupId,
  userId,
  role,
}: AddMemberArgs): Thunk<any> {
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

export function removeMember(membership: Object): Thunk<any> {
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

export function fetchGroup(groupId: number): Thunk<any> {
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

export function fetchAll(): Thunk<any> {
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

export function fetchAllWithType(type: string): Thunk<any> {
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
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Group.UPDATE,
        endpoint: `/groups/${group.id}/`,
        schema: groupSchema,
        method: 'PATCH',
        body: group,
        meta: {
          group,
          errorMessage:
            group.type === 'interesse'
              ? 'Endring av interessegruppe feilet'
              : 'Oppdatering av gruppe feilet',
          successMessage:
            group.type === 'interesse'
              ? 'Endring av interessegruppe fullført'
              : 'Oppdatering av gruppe fullført',
        },
      })
    ).then((_) =>
      group.type === 'interesse'
        ? dispatch(push(`/interestgroups/${group.id}`))
        : null
    );
}

export function joinInterestGroup(
  groupId: number,
  user: Object,
  role: string = 'member'
): Thunk<*> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Membership.JOIN_GROUP,
        endpoint: `/groups/${String(groupId)}/memberships/`,
        schema: membershipSchema,
        method: 'POST',
        body: {
          abakus_group: groupId,
          user: user.id,
          role,
        },
        meta: {
          errorMessage: 'Innmelding i interessegruppen feilet',
          groupId: groupId,
          username: user.username,
        },
      })
    ).then(() => {
      return dispatch(fetchMemberships(groupId));
    });
}

export function leaveInterestGroup(
  membership: Object,
  groupId: number
): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Membership.LEAVE_GROUP,
        endpoint: `/groups/${String(groupId)}/memberships/${membership.id}/`,
        method: 'DELETE',
        meta: {
          id: membership.id,
          username: membership.user.username,
          groupId,
          errorMessage: 'Utmelding av interessegruppen feilet',
        },
      })
    ).then((_) => {
      return dispatch(fetchMemberships(groupId));
    });
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
  descendants: boolean = false,
  query: Object = {}
): Thunk<*> {
  return fetchMembershipsPagination({
    groupId,
    next: true,
    descendants,
    query,
  });
}

export function fetchMembershipsPagination({
  groupId,
  next,
  descendants = false,
  query = {},
}: {
  groupId: number,
  next: boolean,
  descendants?: boolean,
  query?: Object,
}): Thunk<*> {
  return (dispatch, getState) => {
    return dispatch(
      callAPI({
        types: Group.MEMBERSHIP_FETCH,
        endpoint: `/groups/${groupId}/memberships/`,
        schema: [membershipSchema],
        useCache: false,
        pagination: { fetchNext: next },
        query: { ...query, descendants },
        meta: {
          groupId: groupId,
          errorMessage: 'Henting av medlemmene for gruppen feilet',
        },
        propagateError: true,
      })
    );
  };
}

export function createInterestGroup(group: Object): Thunk<*> {
  return (dispatch) => {
    const { name, description, text, logo } = group;
    return dispatch(
      callAPI({
        types: Group.CREATE,
        endpoint: '/groups/',
        schema: groupSchema,
        method: 'POST',
        body: {
          name,
          description,
          text,
          logo,
          type: 'interesse',
        },
        meta: {
          group,
          errorMessage: 'Opprettelse av interessegruppe feilet',
        },
      })
    ).then((action) => {
      if (!action || !action.payload) {
        return;
      }
      const groupId = action.payload.result;
      dispatch(push(`/interestgroups/${groupId}`));
    });
  };
}

export function removeInterestGroup(id: string): Thunk<*> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Group.REMOVE,
        endpoint: `/groups/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Sletting av interessegruppe feilet',
        },
      })
    ).then(() => dispatch(push('/interestgroups/')));
}
