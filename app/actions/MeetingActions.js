// @flow

import { Meeting } from './ActionTypes';
import { meetingSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import moment from 'moment';
import type { Thunk } from 'app/types';
import type { UserEntity } from 'app/reducers/users';

export function fetchMeeting(meetingId: string) {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: `/meetings/${meetingId}/`,
    schema: meetingSchema,
    meta: {
      errorMessage: `Henting av møte ${meetingId} feilet`
    },
    propagateError: true
  });
}

export function fetchAll() {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: '/meetings/',
    schema: [meetingSchema],
    meta: {
      errorMessage: 'Henting av møter feilet'
    },
    propagateError: true
  });
}

export function setInvitationStatus(
  meetingId: number,
  status: string,
  user: UserEntity
) {
  return callAPI({
    types: Meeting.SET_INVITATION_STATUS,
<<<<<<< HEAD
    endpoint: `/meetings/${meetingId}/invitations/${userId}/`,
    method: 'PUT',
=======
    endpoint: `/meetings/${meetingId}/invitations/${user.id}/`,
    method: 'put',
>>>>>>> Cleanup in meetingsEditor
    body: {
      user: user.id,
      status
    },
    meta: {
      errorMessage: 'Endring av invitasjonstatus feilet',
      meetingId,
      status,
      user
    }
  });
}

export function deleteMeeting(id: number): Thunk<*> {
  return callAPI({
    types: Meeting.DELETE,
    endpoint: `/meetings/${id}/`,
    method: 'DELETE',
    meta: {
      meetingId: id,
      errorMessage: 'Sletting av møte feilet'
    }
  });
}

export function createMeeting({
  title,
  report,
  location,
  startTime,
  endTime,
  reportAuthor,
  users,
  groups
}: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('meetingEditor'));
    return dispatch(
      callAPI({
        types: Meeting.CREATE,
        endpoint: '/meetings/',
        method: 'POST',
        body: {
          title,
          report,
          location,
          endTime: moment(endTime).toISOString(),
          startTime: moment(startTime).toISOString(),
          reportAuthor
        },
        schema: meetingSchema,
        meta: {
          errorMessage: 'Opprettelse av møte feilet'
        }
      })
    )
      .then(result => {
        if (!result || !result.payload) return;
        const id = result.payload.result;
        if (groups !== undefined || users !== undefined) {
          dispatch(inviteUsersAndGroups({ id, users, groups }))
            .then(() => {
              dispatch(stopSubmit('meetingEditor'));
              dispatch(push(`/meetings/${id}`));
            })
            .catch(action => {
              const errors = { ...action.error.response.jsonData };
              dispatch(stopSubmit('meetingEditor', errors));
            });
        } else {
          dispatch(stopSubmit('meetingEditor'));
          dispatch(push(`/meetings/${id}`));
        }
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('meetingEditor', errors));
      });
  };
}

export function inviteUsersAndGroups({ id, users, groups }: Object) {
  return callAPI({
    types: Meeting.EDIT,
    endpoint: `/meetings/${id}/bulk_invite/`,
    method: 'POST',
    body: {
      users: users ? users.map(user => user.value) : [],
      groups: groups ? groups.map(group => group.value) : []
    },
    meta: {
      errorMessage: 'Feil ved invitering av brukere/grupper'
    }
  });
}

export function answerMeetingInvitation(
  action: string,
  token: string,
  loggedIn: boolean
): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('answerMeetingInvitation'));

    return dispatch(
      callAPI({
        types: Meeting.ANSWER_INVITATION_TOKEN,
        endpoint: `/meeting-token/${action}/?token=${token}`,
        method: 'POST',
        meta: {
          errorMessage: 'Svar på invitasjon feilet'
        },
        useCache: true
      })
    )
      .then(() => {
        dispatch(stopSubmit('answerMeetingInvitation'));
      })
      .catch(() => {
        dispatch(stopSubmit('answerMeetingInvitation', null));
      });
  };
}

export function editMeeting({
  title,
  report,
  location,
  startTime,
  endTime,
  reportAuthor,
  id,
  users,
  groups
}: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('meetingEditor'));

    return dispatch(
      callAPI({
        types: Meeting.EDIT,
        endpoint: `/meetings/${id}/`,
        method: 'PUT',
        body: {
          title,
          id,
          report,
          location,
          endTime: moment(endTime).toISOString(),
          startTime: moment(startTime).toISOString(),
          reportAuthor
        },
        schema: meetingSchema,
        meta: {
          errorMessage: 'Endring av møte feilet'
        }
      })
    )
      .then(() => {
        if (groups !== undefined || users !== undefined) {
          dispatch(inviteUsersAndGroups({ id, users, groups }))
            .then(() => {
              dispatch(stopSubmit('meetingEditor'));
              dispatch(push(`/meetings/${id}`));
            })
            .catch(action => {
              const errors = { ...action.error.response.jsonData };
              dispatch(stopSubmit('meetingEditor', errors));
            });
        } else {
          dispatch(stopSubmit('meetingEditor'));
          dispatch(push(`/meetings/${id}`));
        }
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('meetingEditor', errors));
      });
  };
}

export function resetMeetingsToken() {
  return {
    type: Meeting.RESET_MEETINGS_TOKEN
  };
}
