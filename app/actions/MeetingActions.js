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
