// @flow

import { groupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { InterestGroup, Membership, Group } from './ActionTypes';
import { push } from 'react-router-redux';
import { omit } from 'lodash';
import type { Thunk } from 'app/types';
import createQueryString from 'app/utils/createQueryString';

function fetchMemberships(groupId: Number) {
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

export function fetchInterestGroup(interestGroupId: Number) {
  return dispatch => {
    const group = dispatch(
      callAPI({
        types: InterestGroup.FETCH,
        endpoint: `/groups/${interestGroupId}/${createQueryString({
          type: 'interesse'
        })}`,
        schema: groupSchema,
        meta: {
          errorMessage: 'Henting av interessegruppe feilet'
        },
        propagateError: true
      })
    );
    const memberships = dispatch(fetchMemberships(interestGroupId));
    return Promise.all([group, memberships]);
  };
}

export function fetchAll() {
  return dispatch => {
    return dispatch(
      callAPI({
        types: InterestGroup.FETCH_ALL,
        endpoint: `/groups/${createQueryString({
          type: 'interesse'
        })}`,
        schema: [groupSchema],
        meta: {
          errorMessage: 'Henting av interessegrupper feilet'
        },
        propagateError: true
      })
    ).then(res => {
      const ids = res.payload.result;
      return Promise.all(ids.map(g => dispatch(fetchMemberships(g))));
    });
  };
}

export function createInterestGroup(group: Object): Thunk<*> {
  return dispatch => {
    const { name, description, text, logo } = group;
    dispatch(
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
          type: 'interesse'
        },
        meta: {
          group,
          errorMessage: 'Opprettelse av interessegruppe feilet'
        }
      })
    ).then(action => {
      if (!action || !action.payload) {
        return;
      }
      const groupId = action.payload.result;
      dispatch(push(`/interestgroups/${groupId}`));
    });
  };
}

export function removeInterestGroup(id: string): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: InterestGroup.REMOVE,
        endpoint: `/groups/${id}/`,
        method: 'DELETE',
        meta: {
          groupId: id,
          errorMessage: 'Sletting av interessegruppe feilet'
        }
      })
    ).then(() => dispatch(push('/interestgroups/')));
}

export function editInterestGroup(group: Object): Thunk<*> {
  const { id } = group;
  return dispatch =>
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/groups/${id}/`,
        schema: groupSchema,
        method: 'PATCH',
        body: group.logo ? group : omit(group, 'logo'),
        meta: {
          group,
          errorMessage: 'Endring av interessegruppe feilet'
        }
      })
    ).then(_ => dispatch(push(`/interestgroups/${group.id}`)));
}

export function joinInterestGroup(
  groupId: Number,
  user: Object,
  role: string = 'member'
): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Membership.JOIN_GROUP,
        endpoint: `/groups/${groupId}/memberships/`,
        schema: membershipSchema,
        method: 'POST',
        body: {
          abakus_group: groupId,
          user: user.id,
          role
        },
        meta: {
          errorMessage: 'Innmelding i interessegruppen feilet',
          groupId: groupId,
          username: user.username
        }
      })
    ).then(() => {
      return dispatch(fetchMemberships(groupId));
    });
}

export function leaveInterestGroup(
  membership: Object,
  groupId: Number
): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Membership.LEAVE_GROUP,
        endpoint: `/groups/${groupId}/memberships/${membership.id}/`,
        method: 'DELETE',
        meta: {
          id: membership.id,
          username: membership.user.username,
          groupId,
          errorMessage: 'Utmelding av interessegruppen failet'
        }
      })
    ).then(_ => {
      return dispatch(fetchMemberships(groupId));
    });
  };
}
