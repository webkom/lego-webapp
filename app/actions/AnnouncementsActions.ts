import { stopSubmit } from 'redux-form';
import callAPI from 'app/actions/callAPI';
import { announcementsSchema } from 'app/reducers';
import { Announcements } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchAll(): Thunk<any> {
  return callAPI({
    types: Announcements.FETCH_ALL,
    endpoint: '/announcements/',
    schema: [announcementsSchema],
    meta: {
      errorMessage: 'Henting av kunngjøringer feilet',
    },
    propagateError: true,
  });
}
export function createAnnouncement({
  message,
  users,
  groups,
  events,
  meetings,
  fromGroup,
  send,
}: Record<string, any>): /*AnnouncementModel*/
Thunk<any> {
  return (dispatch) =>
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
          meetings,
          fromGroup,
        },
        schema: announcementsSchema,
        meta: {
          errorMessage: 'Opprettelse av kunngjøringer feilet',
        },
      })
    )
      .then((action) => {
        if (send && action && action.payload) {
          dispatch(sendAnnouncement(action.payload.result));
        }
      })
      .catch((action) => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('AnnouncementsCreate', errors));
      });
}
export function sendAnnouncement(announcementId: number): Thunk<any> {
  return callAPI({
    types: Announcements.SEND,
    endpoint: `/announcements/${announcementId}/send/`,
    method: 'POST',
    meta: {
      errorMessage: 'Sending av kunngjøringer feilet',
      announcementId,
    },
  });
}
export function deleteAnnouncement(id: number): Thunk<any> {
  return callAPI({
    types: Announcements.DELETE,
    endpoint: `/announcements/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av kunngjøringer feilet',
    },
  });
}
