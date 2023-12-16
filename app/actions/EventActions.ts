import { push } from 'redux-first-history';
import { addToast } from 'app/actions/ToastActions';
import callAPI from 'app/actions/callAPI';
import {
  eventSchema,
  eventAdministrateSchema,
  followersEventSchema,
} from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { Event } from './ActionTypes';
import type { EventRegistrationPresence } from 'app/models';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type {
  DetailedEvent,
  ListEvent,
  UnknownEvent,
} from 'app/store/models/Event';
import type { Thunk, Action } from 'app/types';

export const waitinglistPoolId = -1;

export function fetchEvent(eventId: ID) {
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
    return Promise.resolve(null);
  }

  if (refresh && !loadNextPage) {
    dispatch({
      type: Event.CLEAR,
    });
  }

  dispatch(fetchList({ endpoint, queryString }));
};

const getEndpoint = (
  pagination: any,
  queryString: string,
  loadNextPage?: boolean
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

export function fetchAdministrate(eventId: ID) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av registreringer feilet',
    },
  });
}

export function fetchAllergies(eventId: ID) {
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
  return (dispatch: AppDispatch) =>
    dispatch(
      callAPI<UnknownEvent>({
        types: Event.CREATE,
        endpoint: '/events/',
        method: 'POST',
        body: event,
        schema: eventSchema,
        meta: {
          errorMessage: 'Opprettelse av arrangement feilet',
        },
      })
    ).then(
      (action) =>
        'success' in action &&
        dispatch(push(`/events/${action.payload.result}/`))
    );
}

export function editEvent(event: Record<string, any>) {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.EDIT,
        endpoint: `/events/${event.id}/`,
        method: 'PUT',
        body: { ...event, cover: event.cover || undefined },
        meta: {
          errorMessage: 'Endring av arrangement feilet',
        },
      })
    ).then(() => dispatch(push(`/events/${event.id}`)));
}

export function deleteEvent(eventId: ID) {
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
  eventId: ID;
  captchaResponse: string;
  feedback: string;
  userId: ID;
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
  eventId: ID;
  registrationId: ID;
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
  eventId: ID,
  userId: ID,
  poolId: ID | undefined,
  feedback: string,
  adminRegistrationReason: string
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

export function payment(eventId: ID) {
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
  eventId: ID,
  registrationId: ID,
  feedback: string
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

export function markUsernamePresent(eventId: ID, username: string) {
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
  eventId: ID,
  registrationId: ID,
  presence: EventRegistrationPresence
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
  eventId: ID,
  registrationId: ID,
  paymentStatus: string
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

export function follow(userId: ID, eventId: ID) {
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

export function unfollow(followId: ID, eventId: ID) {
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

export function isUserFollowing(eventId: ID) {
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

export function fetchAnalytics(eventId: ID) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${String(eventId)}/statistics/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av analyse feilet',
    },
  });
}
