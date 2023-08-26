import callAPI from 'app/actions/callAPI';
import { announcementsSchema } from 'app/reducers';
import { Announcements } from './ActionTypes';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type {
  DetailedAnnouncement,
  ListAnnouncement,
} from 'app/store/models/Announcement';

export function fetchAll() {
  return callAPI<ListAnnouncement[]>({
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
}: Record<string, any>) {
  return (dispatch: AppDispatch) =>
    dispatch(
      callAPI<DetailedAnnouncement>({
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
          successMessage: 'Kunngjøring opprettet',
        },
      })
    ).then((action) => {
      if (send) {
        dispatch(sendAnnouncement(action.payload.result));
      }
    });
}

export function sendAnnouncement(announcementId: ID) {
  return callAPI<{ status: string }>({
    types: Announcements.SEND,
    endpoint: `/announcements/${announcementId}/send/`,
    method: 'POST',
    meta: {
      errorMessage: 'Sending av kunngjøringer feilet',
      successMessage: 'Kunngjøring sendt',
      announcementId,
    },
  });
}

export function deleteAnnouncement(id: ID) {
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
