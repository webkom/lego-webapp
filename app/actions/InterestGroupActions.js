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
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: InterestGroup.FETCH_ALL,
    endpoint: '/interest-groups/',
    schema: [interestGroupSchema],
    meta: {
      errorMessage: 'Fetching interestGroups failed'
    }
  });
}

export function createInterestGroup(
  name: string,
  description: string,
  text: string
) {
  return callAPI({
    types: InterestGroup.CREATE,
    endpoint: '/interest-groups/',
    schema: interestGroupSchema,
    method: 'POST',
    body: {
      name,
      description,
      text
    },
    meta: {
      errorMessage: 'Creating interestGroup failed'
    }
  });
}

export function removeInterestGroup(id: string) {
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.REMOVE,
        endpoint: `/interest-groups/${id}/`,
        method: 'DELETE',
        meta: {
          interestGroupId: id,
          errorMessage: 'Removing interestGroup failed'
        }
      })
    ).then(() => dispatch(push('/interestgroups/')));
  };
}

export function updateInterestGroup(
  id: string,
  name: string,
  description: string,
  text: string
) {
  return dispatch => {
    dispatch(
      callAPI({
        types: InterestGroup.UPDATE,
        endpoint: `/interest-groups/${id}/`,
        method: 'PATCH',
        body: {
          name,
          description,
          text
        },
        meta: {
          interestGroupId: id,
          errorMessage: 'Editing interestGroup failed'
        }
      })
    ).then(() => dispatch(push(`/interestgroups/${id}`)));
  };
}

export function joinInterestGroup(id, user) {
  return callAPI({
    types: InterestGroup.JOIN,
    endpoint: '/memberships/',
    method: 'POST',
    body: {
      abakus_group: id,
      user: user.id
    },
    meta: {
      errorMessage: 'Joining the interest group failed.',
      groupId: id,
      user: user,
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
