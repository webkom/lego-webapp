import { Announcements } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { announcementsSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailedAnnouncement,
  ListAnnouncement,
} from '~/redux/models/Announcement';
import type { MeetingInvitationStatus } from '~/redux/models/MeetingInvitation';

export type CreateAnnouncementPayload = {
  message: string;
  users?: (string | undefined)[];
  groups?: (string | undefined)[];
  events?: (string | undefined)[];
  meetings?: (string | undefined)[];
  excludeWaitingList?: boolean;
  meetingInvitationStatus?: MeetingInvitationStatus;
  fromGroup?: string;
  send: boolean;
};

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

export function createAnnouncement(body: CreateAnnouncementPayload) {
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
