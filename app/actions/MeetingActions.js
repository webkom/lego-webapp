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

export function createMeeting({ title, report, location, startTime, endTime, reportAuthor }) {
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
      dispatch(stopSubmit('meetingEditor'));
      dispatch(push(`/meetings/${result.payload.result}`));
    }).catch((action) => {
      const errors = { ...action.error.response.jsonData };
      dispatch(stopSubmit('meetingEditor', errors));
    });
  };
}

export function editMeeting({ title, report, location, startTime, endTime, reportAuthor, id }) {
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
      dispatch(stopSubmit('meetingEditor'));
      dispatch(push(`/meetings/${id}`));
    }).catch((action) => {
      const errors = { ...action.error.response.jsonData };
      dispatch(stopSubmit('meetingEditor', errors));
    });
  };
}
