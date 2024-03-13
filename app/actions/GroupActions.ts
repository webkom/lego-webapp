import callAPI from 'app/actions/callAPI';
import { groupSchema, membershipSchema } from 'app/reducers';
import { Group, Membership } from './ActionTypes';
import type { GroupType } from 'app/models';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type MembershipType from 'app/store/models/Membership';
import type { CurrentUser } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';

export type AddMemberArgs = {
  groupId: ID;
  userId: ID;
  role: RoleType;
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

export function removeMember(membership: MembershipType) {
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

export function fetchGroup(groupId: ID, { propagateError = true } = {}) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/${groupId}/`,
    schema: groupSchema,
    meta: {
      errorMessage: 'Henting av gruppe feilet',
    },
    propagateError,
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

export function fetchAllWithType(type: GroupType) {
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

export function editGroup(group: Record<string, any>) {
  return callAPI({
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
  });
}

export function joinGroup(groupId: ID, user: CurrentUser, role = 'member') {
  return (dispatch: AppDispatch) =>
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
      return dispatch(fetchMemberships({ groupId }));
    });
}

export function leaveGroup(membership: MembershipType, groupId: ID) {
  return (dispatch: AppDispatch) => {
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
      return dispatch(fetchMemberships({ groupId }));
    });
  };
}

export function fetchAllMemberships(groupId: ID, descendants = false) {
  return (dispatch: AppDispatch) => {
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

export function fetchMemberships({
  groupId,
  descendants = false,
  query = {},
  propagateError = true,
}: {
  groupId: ID;
  descendants?: boolean;
  query?: Record<string, any>;
  propagateError?: boolean;
}) {
  return fetchMembershipsPagination({
    groupId,
    descendants,
    next: true,
    query,
    propagateError,
  });
}

export function fetchMembershipsPagination({
  groupId,
  next,
  descendants = false,
  query = {},
  propagateError = true,
}: {
  groupId: ID;
  next: boolean;
  descendants: boolean;
  query?: Record<string, string | number | boolean>;
  propagateError?: boolean;
}) {
  return callAPI<MembershipType[]>({
    types: Group.MEMBERSHIP_FETCH,
    endpoint: `/groups/${groupId}/memberships/`,
    schema: [membershipSchema],
    pagination: {
      fetchNext: next,
    },
    query: descendants ? { ...query, descendants } : query,
    meta: {
      groupId: groupId,
      errorMessage: 'Henting av medlemmene for gruppen feilet',
    },
    propagateError,
  });
}

export function createGroup(group: Record<string, any>) {
  const { name, description, text, logo, type, showBadge, active } = group;
  return callAPI({
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
  });
}
