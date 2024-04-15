import callAPI from 'app/actions/callAPI';
import {
  eventSchema,
  eventAdministrateSchema,
  followersEventSchema,
} from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { Event } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { AppDispatch } from 'app/store/createStore';
import type { DetailedEvent, ListEvent } from 'app/store/models/Event';
import type { Presence } from 'app/store/models/Registration';
import type { Thunk, Action } from 'app/types';

export const waitinglistPoolId = -1;

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
    propagateError: true,
  });
}

export const fetchData = ({
  dateAfter,
  dateBefore,
  refresh,
  loadNextPage,
  pagination,
  dispatch,
}: {
  dateAfter?: string;
  dateBefore?: string;
  refresh?: boolean;
  loadNextPage?: boolean;
  pagination: any;
  dispatch: AppDispatch;
}) => {
  const query = {
    date_after: dateAfter,
    date_before: dateBefore,
  };

  if (dateBefore && dateAfter) {
    query.page_size = 60;
  }

  const queryString = createQueryString(query);
  const endpoint = getEndpoint(pagination, queryString, loadNextPage);

  if (!endpoint) {
    return Promise.resolve();
  }

  if (refresh && !loadNextPage) {
    dispatch({
      type: Event.CLEAR,
    });
  }

  return dispatch(fetchList({ endpoint, queryString }));
};

export const getEndpoint = (
  pagination: any,
  queryString: string,
  loadNextPage?: boolean,
) => {
  let endpoint = `/events/${queryString}`;
  const paginationObject = pagination[queryString];

  if (
    loadNextPage &&
    paginationObject &&
    paginationObject.queryString === queryString &&
    paginationObject.nextPage
  ) {
    endpoint = paginationObject.nextPage;
  }

  return endpoint;
};

export const fetchList = ({
  endpoint,
  queryString,
}: {
  endpoint: string;
  queryString: string;
}) => {
  return callAPI<ListEvent[]>({
    types: Event.FETCH,
    endpoint: endpoint,
    schema: [eventSchema],
    meta: {
      errorMessage: 'Fetching events failed',
      queryString,
      endpoint,
    },
    propagateError: true,
  });
};

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
  return callAPI({
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
    schema: followersEventSchema,
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

export function isUserFollowing(eventId: EntityId) {
  return callAPI<boolean>({
    types: Event.IS_USER_FOLLOWING,
    endpoint: `/followers-event/?target=${eventId}`,
    schema: [followersEventSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av interesse feilet',
    },
  });
}

export function fetchAnalytics(eventId: EntityId) {
  return callAPI<
    {
      bounceRate: number | null;
      date: string;
      pageviews: number | null;
      visitDuration: number | null;
      visitors: number | null;
    }[]
  >({
    types: Event.FETCH_ANALYTICS,
    endpoint: `/events/${String(eventId)}/statistics/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av analyse feilet',
    },
  });
}
