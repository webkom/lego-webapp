// @flow

import { interestGroupSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { InterestGroup } from './ActionTypes';
import { push } from 'react-router-redux';

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

export function createInterestGroup(group: object) {
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
          group: group,
          errorMessage: 'Creating interestGroup failed'
        }
      })
    ).then(res => {
      // We cannot use the group from res.payload,
      // since we need the memberships from the form.
      const groupId = res.payload.result;
      const group = res.meta.group;
      const members = group.members || [];
      const leaderId = group.leader.value;
      members.map(m => {
        const id = m.value;
        const role = m.value === leaderId ? 'leader' : 'member';
        joinInterestGroup(groupId, id, role)(dispatch);
      });
      dispatch(push(`/interestgroups/${groupId}`));
    });
  };
}

export function removeInterestGroup(id: string) {
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

export function editInterestGroup(group: object) {
  const { id } = group;
  if (!group.logo) {
    delete group.logo;
  }
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/interest-groups/${id}/`,
        method: 'PATCH',
        body: {
          ...group
        },
        meta: {
          interestGroupId: id,
          errorMessage: 'Editing interestGroup failed'
        }
      })
    ).then(() => dispatch(push(`/interestgroups/${id}`)));
  };
}

export function joinInterestGroup(groupId, userId, role = 'member') {
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.JOIN,
        endpoint: '/memberships/',
        method: 'POST',
        body: {
          abakus_group: groupId,
          user: userId,
          role
        },
        meta: {
          errorMessage: 'Joining the interest group failed.',
          groupId: groupId,
          userId
        }
      })
    );
  };
}

export function leaveInterestGroup(membership) {
  return callAPI({
    types: InterestGroup.LEAVE,
    endpoint: `/memberships/${membership.id}/`,
    method: 'DELETE',
    meta: {
      user: membership.user,
      groupId: membership.abakusGroup,
      errorMessage: 'Leaving the interest group failed.'
    }
  });
}
