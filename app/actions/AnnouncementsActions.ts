import createApiThunk from 'app/actions/createApiThunk';
import { createPayloadNormalizer } from 'app/actions/createApiThunk/normalizePayload';
import { announcementsSchema } from 'app/reducers';
import { EntityType } from 'app/store/models/entities';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedAnnouncement } from 'app/store/models/Announcement';

export const fetchAllAnnouncements = createApiThunk(
  EntityType.Announcements as const,
  'fetchAll',
  {
    endpoint: '/announcements/',
    errorMessage: 'Henting av kunngjøringer feilet',
    propagateError: true,
  },
  createPayloadNormalizer<
    { [EntityType.Announcements]: DetailedAnnouncement },
    EntityId[]
  >([announcementsSchema]),
);

export const createAnnouncement = createApiThunk(
  EntityType.Announcements,
  'create',
  (body: Record<string, unknown>) => ({
    endpoint: '/announcements/',
    method: 'POST',
    body,
    errorMessage: 'Opprettelse av kunngjøring feilet',
    successMessage: 'Kunngjøring opprettet',
  }),
  createPayloadNormalizer<
    { [EntityType.Announcements]: DetailedAnnouncement },
    EntityId
  >(announcementsSchema),
);

export const sendAnnouncement = createApiThunk(
  EntityType.Announcements,
  'send',
  (announcementId: EntityId) => ({
    endpoint: `/announcements/${announcementId}/send/`,
    method: 'POST',
    errorMessage: 'Sending av kunngjøringer feilet',
    successMessage: 'Kunngjøring sendt',
    extraMeta: { announcementId },
  }),
  (payload) =>
    payload as {
      status: string;
    },
);

export const deleteAnnouncement = createApiThunk(
  EntityType.Announcements,
  'delete',
  (announcementId: EntityId) => ({
    endpoint: `/announcements/${announcementId}/`,
    method: 'DELETE',
    deleteId: announcementId,
    errorMessage: 'Sletting av kunngjøring feilet',
    successMessage: 'Kunngjøring slettet',
  }),
  () => {},
);
