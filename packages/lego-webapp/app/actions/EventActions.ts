import callAPI from 'app/actions/callAPI';
import { eventSchema, eventAdministrateSchema } from 'app/reducers';
import { Event } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedEvent } from 'app/store/models/Event';
import type { Presence, ReadRegistration } from 'app/store/models/Registration';
import type { Thunk, Action } from 'app/types';

export const waitinglistPoolId = -1;

export function fetchEvents({ query, next = false }) {
  return callAPI({
    types: Event.FETCH,
    endpoint: '/events/',
    schema: [eventSchema],
    query,
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av arrangementer feilet',
    },
    propagateError: true,
  });
}

export function fetchEvent(eventId: EntityId) {
  return callAPI<DetailedEvent>({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Henting av arrangement feilet',
    },
    propagateError: true,
  });
}

export function fetchPrevious() {
  return callAPI({
    types: Event.FETCH_PREVIOUS,
    endpoint: '/events/previous/',
    schema: [eventSchema],
    meta: {
      errorMessage: 'Henting av tidligere arrangementer feilet',
    },
    pagination: { fetchNext: false },
    propagateError: true,
  });
}

export function fetchUpcoming() {
  return callAPI({
    types: Event.FETCH_UPCOMING,
    endpoint: '/events/upcoming/',
    schema: [eventSchema],
    meta: {
      errorMessage: 'Henting av kommende arrangementer feilet',
    },
    pagination: { fetchNext: false },
    propagateError: true,
  });
}

export function fetchAdministrate(eventId: EntityId) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av registreringer feilet',
    },
  });
}

export function fetchAllergies(eventId: EntityId) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/allergies/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av allergier feilet',
    },
  });
}

export function createEvent(event: Record<string, any>) {
  return callAPI<DetailedEvent>({
    types: Event.CREATE,
    endpoint: '/events/',
    method: 'POST',
    body: event,
    schema: eventSchema,
    meta: {
      errorMessage: 'Opprettelse av arrangement feilet',
    },
  });
}

export function editEvent(event: Record<string, any>) {
  return callAPI<DetailedEvent>({
    types: Event.EDIT,
    endpoint: `/events/${event.id}/`,
    method: 'PUT',
    body: { ...event, cover: event.cover || undefined },
    meta: {
      errorMessage: 'Endring av arrangement feilet',
    },
  });
}

export function deleteEvent(eventId: EntityId) {
  return callAPI({
    types: Event.DELETE,
    endpoint: `/events/${eventId}/`,
    method: 'DELETE',
    meta: {
      id: eventId,
      errorMessage: 'Sletting av arrangement feilet',
    },
  });
}

export function register({
  eventId,
  captchaResponse,
  feedback,
  userId,
}: {
  eventId: EntityId;
  captchaResponse: string;
  feedback: string;
  userId: EntityId;
}) {
  return callAPI({
    types: Event.REQUEST_REGISTER,
    endpoint: `/events/${eventId}/registrations/`,
    method: 'POST',
    body: {
      captchaResponse,
      feedback,
    },
    meta: {
      id: eventId,
      userId,
      errorMessage: 'Registering til arrangement feilet',
    },
  });
}

export function unregister({
  eventId,
  registrationId,
  admin = false,
}: {
  eventId: EntityId;
  registrationId: EntityId;
  admin?: boolean;
}) {
  return callAPI({
    types: Event.REQUEST_UNREGISTER,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'DELETE',
    body: {},
    meta: {
      errorMessage: 'Avregistrering fra arrangement feilet',
      admin,
      id: Number(registrationId),
    },
  });
}

export function adminRegister(
  eventId: EntityId,
  userId: EntityId,
  poolId: EntityId | undefined,
  feedback: string,
  adminRegistrationReason: string,
) {
  return callAPI({
    types: Event.ADMIN_REGISTER,
    endpoint: `/events/${eventId}/registrations/admin_register/`,
    method: 'POST',
    body: {
      user: userId,
      pool: poolId === waitinglistPoolId ? undefined : poolId,
      adminRegistrationReason,
      feedback,
    },
    meta: {
      errorMessage: 'Admin registrering feilet',
      successMessage: 'Brukeren ble registrert',
    },
  });
}

export function payment(eventId: EntityId) {
  return callAPI({
    types: Event.PAYMENT_QUEUE,
    endpoint: `/events/${eventId}/payment/`,
    method: 'POST',
    meta: {
      errorMessage: 'Betaling feilet',
    },
  });
}

export function updateFeedback(
  eventId: EntityId,
  registrationId: EntityId,
  feedback: string,
) {
  return callAPI({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      feedback,
    },
    meta: {
      successMessage: 'Tilbakemelding oppdatert',
      errorMessage: 'Tilbakemelding oppdatering feilet',
    },
  });
}

export function markUsernamePresent(eventId: EntityId, username: string) {
  return callAPI<ReadRegistration>({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registration_search/`,
    method: 'POST',
    body: {
      username,
    },
  });
}

export function updatePresence(
  eventId: EntityId,
  registrationId: EntityId,
  presence: Presence,
) {
  return callAPI({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      presence,
    },
    meta: {
      successMessage: 'Tilstedeværelse oppdatert',
      errorMessage: 'Oppdatering av tilstedeværelse feilet',
    },
  });
}

export function updatePayment(
  eventId: EntityId,
  registrationId: EntityId,
  paymentStatus: string,
): Thunk<Promise<Action | null | undefined>> {
  return callAPI({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      paymentStatus,
    },
    meta: {
      errorMessage: 'Oppdatering av betaling feilet',
    },
  });
}

export function follow(userId: EntityId, eventId: EntityId) {
  return callAPI({
    types: Event.FOLLOW,
    enableOptimistic: true,
    endpoint: `/followers-event/`,
    method: 'POST',
    body: {
      target: eventId,
      follower: userId,
    },
    meta: {
      errorMessage: 'Registrering av interesse feilet',
    },
  });
}

export function unfollow(followId: EntityId, eventId: EntityId) {
  return callAPI({
    types: Event.UNFOLLOW,
    endpoint: `/followers-event/${followId}/`,
    enableOptimistic: true,
    method: 'DELETE',
    meta: {
      id: followId,
      eventId,
      errorMessage: 'Avregistrering fra interesse feilet',
    },
  });
}

export function fetchFollowers(eventId: EntityId, currentUserId: EntityId) {
  return callAPI({
    types: Event.FETCH_FOLLOWERS,
    endpoint: `/followers-event/?target=${eventId}`,
    method: 'GET',
    meta: {
      eventId,
      currentUserId,
      errorMessage: 'Henting av stjernemarkering feilet',
    },
  });
}

export type Analytics = {
  bounceRate: number | null;
  date: string;
  pageviews: number | null;
  visitDuration: number | null;
  visitors: number | null;
};

export function fetchAnalytics(eventId: EntityId) {
  return callAPI<{
    results: Analytics[];
  }>({
    types: Event.FETCH_ANALYTICS,
    endpoint: `/events/${String(eventId)}/statistics/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av analyse feilet',
    },
  });
}
