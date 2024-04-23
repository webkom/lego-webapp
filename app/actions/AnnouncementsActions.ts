import callAPI from 'app/actions/callAPI';
import { announcementsSchema } from 'app/reducers';
import { Announcements } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { FormValues as CreateAnnouncementFormValues } from 'app/routes/announcements/components/AnnouncementsCreate';
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

export function createAnnouncement(body: CreateAnnouncementFormValues) {
  return callAPI<DetailedAnnouncement>({
    types: Announcements.CREATE,
    endpoint: '/announcements/',
    method: 'POST',
    body,
    schema: announcementsSchema,
    meta: {
      errorMessage: 'Opprettelse av kunngjøringer feilet',
      successMessage: 'Kunngjøring opprettet',
    },
  });
}

export function sendAnnouncement(announcementId: EntityId) {
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

export function deleteAnnouncement(id: EntityId) {
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
