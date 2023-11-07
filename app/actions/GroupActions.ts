import { push } from 'connected-react-router';
import callAPI from 'app/actions/callAPI';
import { groupSchema, membershipSchema } from 'app/reducers';
import { Group, Membership } from './ActionTypes';
import type { ID } from 'app/store/models';
import type MembershipType from 'app/store/models/Membership';
import type { Thunk } from 'app/types';
import type { RoleType } from 'app/utils/constants';

export type AddMemberArgs = {
  groupId: ID;
  userId: ID;
  role: RoleType;
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
export function removeMember(membership: MembershipType): Thunk<any> {
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
export function editGroup(group: Record<string, any>): Thunk<any> {
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
    ).then(() =>
      group.type === 'interesse'
        ? dispatch(push(`/interest-groups/${group.id}`))
        : null
    );
}
export function joinGroup(
  groupId: number,
  user: Record<string, any>,
  role = 'member'
): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Membership.JOIN_GROUP,
        endpoint: `/groups/${String(groupId)}/memberships/`,
        schema: membershipSchema,
        method: 'POST',
        body: {
          groupId,
          user: user.id,
          role,
        },
        meta: {
          errorMessage: 'Innmelding i gruppe feilet',
          successMessage: 'Innmelding i gruppe fullført',
          groupId: groupId,
          username: user.username,
        },
      })
    ).then(() => {
      return dispatch(fetchMemberships(groupId));
    });
}
export function leaveGroup(
  membership: Record<string, any>,
  groupId: number
): Thunk<any> {
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
          errorMessage: 'Utmelding fra gruppe feilet',
          successMessage: 'Utmelding fra gruppe fullført',
        },
      })
    ).then(() => {
      return dispatch(fetchMemberships(groupId));
    });
  };
}
export function fetchAllMemberships(
  groupId: number,
  descendants = false
): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      fetchMembershipsPagination({
        descendants,
        groupId,
        next: true,
      })
    ).then(
      (res) =>
        res.payload.next && dispatch(fetchAllMemberships(groupId, descendants))
    );
  };
}
export function fetchMemberships(
  groupId: number,
  descendants = false,
  query: Record<string, any> = {}
): Thunk<any> {
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
  groupId: number;
  next: boolean;
  descendants?: boolean;
  query?: Record<string, string | number | boolean>;
}): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Group.MEMBERSHIP_FETCH,
        endpoint: `/groups/${groupId}/memberships/`,
        schema: [membershipSchema],
        pagination: {
          fetchNext: next,
        },
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
export function createGroup(group: Record<string, any>): Thunk<any> {
  return (dispatch) => {
    const { name, description, text, logo, type, showBadge, active } = group;
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
          type,
          showBadge,
          active,
        },
        meta: {
          group,
          errorMessage:
            group.type === 'interesse'
              ? 'Opprettelse av interessegruppe feilet'
              : 'Opprettelse av gruppe feilet',
          successMessage:
            group.type === 'interesse'
              ? 'Opprettelse av interessegruppe fullført'
              : 'Opprettelse av gruppe fullført',
        },
      })
    ).then((action) => {
      if (!action || !action.payload) {
        return;
      }

      const groupId = action.payload.result;
      dispatch(push(`/interest-groups/${groupId}`));
    });
  };
}
export function removeGroup(
  id: string,
  group: Record<string, any>
): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Group.REMOVE,
        endpoint: `/groups/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage:
            group.type === 'interesse'
              ? 'Sletting av interessegruppe feilet'
              : 'Sletting av gruppe feilet',
          successMessage:
            group.type === 'interesse'
              ? 'Sletting av interessegruppe fullført'
              : 'Sletting av gruppe fullført',
        },
      })
    ).then(() => dispatch(push('/interest-groups/')));
}
