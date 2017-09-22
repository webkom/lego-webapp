// @flow

import { interestGroupSchema, membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { InterestGroup, Membership } from './ActionTypes';
import { push } from 'react-router-redux';
import { setGroupMembers } from './MembershipActions';
import { omit } from 'lodash';
import type { Thunk } from 'app/types';

export function fetchInterestGroup(interestGroupId: string) {
  return callAPI({
    types: InterestGroup.FETCH,
    endpoint: `/interest-groups/${interestGroupId}/`,
    schema: interestGroupSchema,
    meta: {
      errorMessage: 'Fetching interestGroup failed'
    },
    propagateError: true
  });
}

export function fetchAll() {
  return callAPI({
    types: InterestGroup.FETCH_ALL,
    endpoint: '/interest-groups/',
    schema: [interestGroupSchema],
    meta: {
      errorMessage: 'Fetching interestGroups failed'
    },
    propagateError: true
  });
}

export function createInterestGroup(group: Object): Thunk<*> {
  return dispatch => {
    const { name, description, descriptionLong, logo } = group;
    dispatch(
      callAPI({
        types: InterestGroup.CREATE,
        endpoint: '/interest-groups/',
        schema: interestGroupSchema,
        method: 'POST',
        body: {
          name,
          description,
          descriptionLong,
          logo
        },
        meta: {
          group,
          errorMessage: 'Creating interestGroup failed'
        }
      })
    ).then(res => {
      const groupId =
        res.payload.entities.interestGroups[res.payload.result].id;
      const leaderId = Number(group.leader.value);
      const memberships = group.members.map(m => {
        const id = Number(m.value);
        return {
          user: id,
          role: id == leaderId ? 'leader' : 'member'
        };
      });
      dispatch(setGroupMembers(groupId, memberships));
      dispatch(push(`/interestgroups/${groupId}`));
    });
  };
}

export function removeInterestGroup(id: string): Thunk<*> {
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.REMOVE,
        endpoint: `/interest-groups/${id}/`,
        method: 'DELETE',
        meta: {
          groupId: id,
          errorMessage: 'Removing interestGroup failed'
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
        endpoint: `/interest-groups/${id}/`,
        schema: interestGroupSchema,
        method: 'PATCH',
        body: group.logo ? group : omit(group, 'logo'),
        meta: {
          group,
          errorMessage: 'Editing interestGroup failed'
        }
      })
    ).then(res => {
      const leaderId = group.leader.value;
      const memberships = group.members.map(m => ({
        user: Number(m.value),
        role: m.value == leaderId ? 'leader' : 'member'
      }));
      dispatch(setGroupMembers(group.id, memberships)).then(_ =>
        dispatch(push(`/interestgroups/${group.id}`))
      );
    });
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

export function leaveInterestGroup(membership: Object): Thunk<*> {
  return dispatch => {
    dispatch(
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
