// @flow

import callAPI from 'app/actions/callAPI';
import { Announcements } from './ActionTypes';
import { announcementsSchema } from 'app/reducers';
import { startSubmit, stopSubmit } from 'redux-form';
import { reset } from 'redux-form';

export function fetchAll() {
  return callAPI({
    types: Announcements.FETCH_ALL,
    endpoint: '/announcements/',
    schema: [announcementsSchema],
    meta: {
      errorMessage: 'Henting av kunngjøringer feilet'
    },
    propagateError: true
  });
}

export function createAnnouncement({
  message,
  users,
  groups,
  events,
  meetings,
  send
}) {
  return dispatch => {
    dispatch(startSubmit('AnnouncementsCreate'));

    dispatch(
      callAPI({
        types: Announcements.CREATE,
        endpoint: '/announcements/',
        method: 'POST',
        body: {
          message,
          users,
          groups,
          events,
          meetings
        },
        schema: announcementsSchema,
        meta: {
          errorMessage: 'Opprettelse av kunngjøringer feilet'
        }
      })
    )
      .then(result => {
        dispatch(stopSubmit('AnnouncementsCreate'));
        dispatch(reset('announcementsList'));
        if (send) {
          dispatch(sendAnnouncement(result.payload.result));
        }
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('AnnouncementsCreate', errors));
      });
  };
}

export function sendAnnouncement(announcementId) {
  return callAPI({
    types: Announcements.SEND,
    endpoint: `/announcements/${announcementId}/send/`,
    method: 'POST',
    meta: {
      errorMessage: 'Sending av kunngjøringer feilet',
      announcementId
    }
  });
}

export function deleteAnnouncement(announcementId) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Announcements.DELETE,
        endpoint: `/announcements/${announcementId}/`,
        method: 'DELETE',
        meta: {
          announcementId,
          errorMessage: 'Sletting av kunngjøringer feilet'
        }
      })
    );
  };
}
