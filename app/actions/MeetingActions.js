// @flow

import { Meeting } from './ActionTypes';
import { meetingSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import moment from 'moment';

export function fetchMeeting(meetingId: string) {
  return callAPI({
    types: Meeting.FETCH,
    endpoint: `/meetings/${meetingId}/`,
    schema: meetingSchema,
    meta: {
      errorMessage: `Fetching meeting ${meetingId} failed`
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
      errorMessage: 'Fetching meetings failed'
    },
    propagateError: true
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

export function deleteMeeting(id) {
  return dispatch => {
    dispatch(startSubmit('deleteMeeting'));

    dispatch(
      callAPI({
        types: Meeting.DELETE,
        endpoint: `/meetings/${id}/`,
        method: 'delete',
        meta: {
          meetingId: id,
          errorMessage: 'Delete meeting failed'
        }
      })
    )
      .then(() => {
        dispatch(stopSubmit('deleteMeeting'));
        dispatch(push('/meetings/'));
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('deleteMeeting', errors));
      });
  };
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
}) {
  return dispatch => {
    dispatch(startSubmit('meetingEditor'));
    dispatch(
      callAPI({
        types: Meeting.CREATE,
        endpoint: '/meetings/',
        method: 'post',
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
          errorMessage: 'Creating meeting failed'
        }
      })
    )
      .then(result => {
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

export function inviteUsersAndGroups({ id, users, groups }) {
  return callAPI({
    types: Meeting.EDIT,
    endpoint: `/meetings/${id}/bulk_invite/`,
    method: 'post',
    body: {
      users: users ? users.map(user => user.value) : [],
      groups: groups ? groups.map(group => group.value) : []
    },
    meta: {
      errorMessage: 'Error inviting users/groups'
    }
  });
}

export function answerMeetingInvitation(action, token, loggedIn) {
  return dispatch => {
    dispatch(startSubmit('answerMeetingInvitation'));

    return dispatch(
      callAPI({
        types: Meeting.ANSWER_INVITATION_TOKEN,
        endpoint: `/meeting-token/${action}/?token=${token}`,
        method: 'post',
        meta: {
          errorMessage: 'Answer invitation failed'
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
}) {
  return dispatch => {
    dispatch(startSubmit('meetingEditor'));

    dispatch(
      callAPI({
        types: Meeting.EDIT,
        endpoint: `/meetings/${id}/`,
        method: 'put',
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
          errorMessage: 'editing meeting failed'
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
