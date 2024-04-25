import callAPI from 'app/actions/callAPI';
import createApiThunk from 'app/actions/createApiThunk';
import { createPayloadNormalizer } from 'app/actions/createApiThunk/normalizePayload';
import { groupSchema, membershipSchema } from 'app/reducers';
import { EntityType } from 'app/store/models/entities';
import { Group, Membership } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { GroupType } from 'app/models';
import type { TransformedMembership } from 'app/reducers/memberships';
import type { AppDispatch } from 'app/store/createStore';
import type MembershipType from 'app/store/models/Membership';
import type { CurrentUser } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';

export type AddMemberArgs = {
  groupId: EntityId;
  userId: EntityId;
  role: RoleType;
};

export const addMember = createApiThunk(
  EntityType.Memberships,
  'add',
  ({ groupId, userId, role }: AddMemberArgs) => ({
    endpoint: `/groups/${groupId}/memberships/`,
    method: 'POST',
    body: {
      user: userId,
      role,
    },
    errorMessage: 'Innmelding av bruker feilet',
    successMessage: 'Brukeren ble innmeldt',
    extraMeta: {
      groupId,
    },
  }),
  createPayloadNormalizer(membershipSchema),
);

type RemoveMemberArgs = {
  id: EntityId;
  abakusGroup: EntityId;
};
export const removeMember = createApiThunk(
  EntityType.Memberships,
  'remove',
  ({ abakusGroup, id }: RemoveMemberArgs) => ({
    endpoint: `/groups/${abakusGroup}/memberships/${id}/`,
    method: 'DELETE',
    deleteId: id,
    errorMessage: 'Utmelding av bruker feilet',
    extraMeta: {
      groupId: abakusGroup,
    },
  }),
  (payload) => payload as EntityId,
);

export function fetchGroup(groupId: EntityId, { propagateError = true } = {}) {
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

export function fetchAllWithType(type: GroupType | GroupType[]) {
  return callAPI({
    types: Group.FETCH,
    endpoint: `/groups/`,
    query: { type },
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

export function joinGroup(
  groupId: EntityId,
  user: CurrentUser,
  role = 'member',
) {
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
      }),
    ).then(() => {
      return dispatch(fetchMemberships({ groupId }));
    });
}

type LeaveGroupArgs = {
  membership: {
    id: EntityId;
    user: { username: string };
  };
  groupId: EntityId;
};
export const leaveGroup = createApiThunk(
  EntityType.Memberships,
  'leaveGroup',
  ({ membership, groupId }: LeaveGroupArgs) => ({
    endpoint: `/groups/${groupId}/memberships/${membership.id}/`,
    method: 'DELETE',
    deleteId: membership.id,
    errorMessage: 'Utmelding fra gruppe feilet',
    successMessage: 'Utmelding fra gruppe fullført',
    extraMeta: {
      groupId,
    },
    onFulfilled: (_, dispatch) => dispatch(fetchMemberships({ groupId })),
  }),
  () => {},
);

export function fetchAllMemberships(groupId: EntityId, descendants = false) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      fetchMembershipsPagination({
        descendants,
        groupId,
        next: true,
      }),
    ).then(
      (res) =>
        res.payload.next && dispatch(fetchAllMemberships(groupId, descendants)),
    );
  };
}

export function fetchMemberships({
  groupId,
  descendants = false,
  query = {},
  propagateError = true,
}: {
  groupId: EntityId;
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
  groupId: EntityId;
  next: boolean;
  descendants: boolean;
  query?: Record<string, string | number | boolean | undefined>;
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
