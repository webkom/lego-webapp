import { arrayOf } from 'normalizr';
import { Meeting } from './ActionTypes';
import { meetingSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';

export function fetchMeeting(meetingId) {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: `/meetings/${meetingId}/`,
    schema: meetingSchema,
    meta: {
      errorMessage: `Fetching meeting ${meetingId} failed`
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: '/meetings/',
    schema: arrayOf(meetingSchema),
    meta: {
      errorMessage: 'Fetching meetings failed'
    }
  });
}

export function setInvitationStatus(meetingId, status, user) {
  return callAPI({
    types: Meeting.SET_INVITATION_STATUS,
    endpoint: `/meetings/${meetingId}/invitations/${user}/`,
    method: 'put',
    body: {
      user,
      status
    },
    meta: {
      errorMessage: 'Set invitation status failed',
      meetingId,
      status,
      user
    }
  });
}
