import { arrayOf } from 'normalizr';
import { meetingInvitationSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { MeetingInvitations } from './ActionTypes';

// TODO FIXME Add proper implementation of invitations
export function fetchMeetingInvitations(meetingId) {
  return callAPI({
    types: MeetingInvitations.FETCH,
    endpoint: `/meetings/${meetingId}/invitations/`,
    schema: arrayOf(meetingInvitationSchema),
    meta: {
      errorMessage: 'Fetching meeting invitations failed'
    }
  });
}
export function setInvitationStatus(meetingId, status, user) {
  return callAPI({
    types: MeetingInvitations.SET_STATUS,
    endpoint: `/meetings/${meetingId}/invitations/${user}/`,
    method: 'put',
    body: {
      user,
      status
    },
    schema: meetingInvitationSchema,
    meta: {
      errorMessage: 'Set invitation status failed'
    }
  });
}
