import { arrayOf } from 'normalizr';
import { Meeting } from './ActionTypes';
import { meetingSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import moment from 'moment';

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

export function deleteMeeting(id) {
  return (dispatch) => {
    dispatch(startSubmit('deleteMeeting'));

    dispatch(callAPI({
      types: Meeting.DELETE,
      endpoint: `/meetings/${id}/`,
      method: 'DELETE',
      meta: {
        meetingId: id,
        errorMessage: 'Delete meeting failed'
      }
    })).then(() => {
      dispatch(stopSubmit('deleteMeeting'));
      dispatch(push('/meetings/'));
    }).catch((action) => {
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
  return (dispatch) => {
    dispatch(startSubmit('meetingEditor'));
    dispatch(callAPI({
      types: Meeting.CREATE,
      endpoint: '/meetings/',
      method: 'post',
      body: {
        title,
        report,
        location,
        endTime: moment(endTime).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
        startTime: moment(startTime).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
        reportAuthor
      },
      schema: meetingSchema,
      meta: {
        errorMessage: 'Creating meeting failed'
      }
    })).then((result) => {
      const id = result.payload.result;
      if (groups !== undefined || users !== undefined) {
        dispatch(inviteUsersAndGroups({ id, users, groups })).then(() => {
          dispatch(stopSubmit('meetingEditor'));
          dispatch(push(`/meetings/${id}`));
        }).catch((action) => {
          const errors = { ...action.error.response.jsonData };
          dispatch(stopSubmit('meetingEditor', errors));
        });
      } else {
        dispatch(stopSubmit('meetingEditor'));
        dispatch(push(`/meetings/${id}`));
      }
    }).catch((action) => {
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
      users: users ? users.replace(',', '').split(' ') : [],
      groups: groups ? groups.replace(',', '').split(' ') : []
    },
    meta: {
      errorMessage: 'Error inviting users/groups'
    }
  });
}

export function answerMeetingInvitation(action, token, loggedIn) {
  return (dispatch) => {
    dispatch(startSubmit('ansewerMeetingInvitation'));

    dispatch(callAPI({
      types: Meeting.ANSWER_INVITATION_TOKEN,
      endpoint: `/meeting-token/${action}/?token=${token}`,
      method: 'GET',
      meta: {
        errorMessage: 'Answer invitation failed'
      }
    })).then((result) => {
      const { status, meeting, user } = result.payload;
      dispatch(stopSubmit('answerMeetingInvitation'));
      if (loggedIn) {
        dispatch(push(`/meetings/${meeting}/`));
      } else {
        dispatch(push(`/meetings/answer/result/?status=good&meeting=${meeting}&answer=${status}&user=${user.firstName}`));
      }
    }).catch(() => {
      dispatch(stopSubmit('ansewerMeetingInvitation', null));
      dispatch(push('/meetings/answer/result/?status=bad'));
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
  return (dispatch) => {
    dispatch(startSubmit('meetingEditor'));

    dispatch(callAPI({
      types: Meeting.EDIT,
      endpoint: `/meetings/${id}/`,
      method: 'put',
      body: {
        title,
        id,
        report,
        location,
        endTime: moment(endTime).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
        startTime: moment(startTime).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
        reportAuthor
      },
      schema: meetingSchema,
      meta: {
        errorMessage: 'editing meeting failed'
      }
    })).then(() => {
      if (groups !== undefined || users !== undefined) {
        dispatch(inviteUsersAndGroups({ id, users, groups })).then(() => {
          dispatch(stopSubmit('meetingEditor'));
          dispatch(push(`/meetings/${id}`));
        }).catch((action) => {
          const errors = { ...action.error.response.jsonData };
          dispatch(stopSubmit('meetingEditor', errors));
        });
      } else {
        dispatch(stopSubmit('meetingEditor'));
        dispatch(push(`/meetings/${id}`));
      }
    }).catch((action) => {
      const errors = { ...action.error.response.jsonData };
      dispatch(stopSubmit('meetingEditor', errors));
    });
  };
}
