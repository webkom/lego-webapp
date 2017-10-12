// @flow

import { interestGroupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { InterestGroup, Membership } from './ActionTypes';
import { push } from 'react-router-redux';
import { omit } from 'lodash';
import type { Thunk } from 'app/types';

export function fetchInterestGroup(interestGroupId: string) {
  return callAPI({
    types: InterestGroup.FETCH,
    endpoint: `/groups/${interestGroupId}/`,
    schema: interestGroupSchema,
    meta: {
      errorMessage: 'Henting av interessegruppe feilet'
    },
    propagateError: true
  });
}

export function fetchAll() {
  return callAPI({
    types: InterestGroup.FETCH_ALL,
    endpoint: '/groups/?type=interesse',
    schema: [interestGroupSchema],
    meta: {
      errorMessage: 'Henting av interessegrupper feilet'
    },
    propagateError: true
  });
}

export function createInterestGroup(group: Object): Thunk<*> {
  return dispatch => {
    const { name, description, text, logo } = group;
    dispatch(
      callAPI({
        types: InterestGroup.CREATE,
        endpoint: '/groups/',
        schema: interestGroupSchema,
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
    ).then(res => {
      const group = res.payload.entities.interestGroups[res.payload.result];
      dispatch(push(`/interestgroups/${group.id}`));
    });
  };
}

export function removeInterestGroup(id: string): Thunk<*> {
  return dispatch => {
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
  };
}

export function editInterestGroup(group: Object): Thunk<*> {
  const { id } = group;
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/groups/${id}/`,
        schema: interestGroupSchema,
        method: 'PATCH',
        body: group.logo ? group : omit(group, 'logo'),
        meta: {
          group,
          errorMessage: 'Endring av interessegruppe feilet'
        }
      })
    ).then(_ => dispatch(push(`/interestgroups/${group.id}`)));
  };
}

export function joinInterestGroup(
  groupId: number,
  user: Object,
  role: string = 'member'
): Thunk<*> {
  return dispatch => {
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
    );
  };
}

export function leaveInterestGroup(
  membership: Object,
  groupId: Number
): Thunk<*> {
  return dispatch => {
    dispatch(
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
    );
  };
}
