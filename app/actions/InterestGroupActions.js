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
          errorMessage: 'Creating interestGroup failed'
        }
      })
    );
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

export function updateInterestGroupPicture(id: string, token: token) {
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/interest-groups/${id}/`,
        method: 'PATCH',
        body: {
          id: id,
          picture: token
        },
        meta: {
          interestGroupId: id,
          errorMessage: 'Editing interestGroup failed'
        }
      })
    ).then(() => dispatch(push(`/interestgroups/${id}`)));
  };
}

export function joinInterestGroup(id, user, role = 'member') {
  return callAPI({
    types: InterestGroup.JOIN,
    endpoint: '/memberships/',
    method: 'POST',
    body: {
      abakus_group: id,
      user: user.id,
      role
    },
    meta: {
      errorMessage: 'Joining the interest group failed.',
      groupId: id,
      user
    }
  });
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
