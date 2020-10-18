// @flow

import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { InterestGroup, Membership } from './ActionTypes';
import { fetchMemberships } from 'app/actions/GroupActions';
import { push } from 'connected-react-router';
import type { Thunk } from 'app/types';

export function createInterestGroup(group: Object): Thunk<*> {
  return (dispatch) => {
    const { name, description, text, logo } = group;
    return dispatch(
      callAPI({
        types: InterestGroup.CREATE,
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
        types: InterestGroup.REMOVE,
        endpoint: `/groups/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Sletting av interessegruppe feilet',
        },
      })
    ).then(() => dispatch(push('/interestgroups/')));
}

export function editInterestGroup(group: Object): Thunk<*> {
  const { id } = group;
  return (dispatch) =>
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/groups/${id}/`,
        schema: groupSchema,
        method: 'PATCH',
        body: group,
        meta: {
          group,
          errorMessage: 'Endring av interessegruppe feilet',
        },
      })
    ).then((_) => dispatch(push(`/interestgroups/${group.id}`)));
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
          errorMessage: 'Utmelding av interessegruppen failet',
        },
      })
    ).then((_) => {
      return dispatch(fetchMemberships(groupId));
    });
  };
}
