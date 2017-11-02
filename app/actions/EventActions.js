// @flow

import { push } from 'react-router-redux';
import { eventSchema, eventAdministrateSchema } from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import callAPI from 'app/actions/callAPI';
import { Event } from './ActionTypes';
import { addNotification } from 'app/actions/NotificationActions';
import type { Thunk, Action } from 'app/types';

export function fetchEvent(eventId: string) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Henting av hendelse feilet'
    },
    propagateError: true
  });
}

const getEndpoint = (state, loadNextPage, queryString) => {
  const pagination = state.events.pagination;
  let endpoint = `/events/${queryString}`;
  const paginationObject = pagination[queryString];
  if (
    loadNextPage &&
    paginationObject &&
    paginationObject.queryString === queryString
  ) {
    endpoint = pagination[queryString].nextPage;
  }
  return endpoint;
};

export const fetchList = (
  { dateAfter, dateBefore, refresh = false, loadNextPage = false }: Object = {}
): Thunk<*> => (dispatch, getState) => {
  const query: Object = { date_after: dateAfter, date_before: dateBefore };
  if (dateBefore && dateAfter) {
    query.page_size = 60;
  }
  const queryString = createQueryString(query);
  const endpoint = getEndpoint(getState(), loadNextPage, queryString);
  if (!endpoint) {
    return Promise.resolve(null);
  }
  if (refresh && !loadNextPage) {
    dispatch({
      type: Event.CLEAR
    });
  }
  return dispatch(
    callAPI({
      types: Event.FETCH,
      endpoint: endpoint,
      schema: [eventSchema],
      meta: {
        errorMessage: 'Fetching events failed',
        queryString,
        endpoint
      },
      useCache: refresh,
      cacheSeconds: Infinity, // don't expire cache unless we pass useCache
      propagateError: true
    })
  );
};

export function fetchAdministrate(eventId: string) {
  return callAPI({
    types: Event.ADMINISTRATE_FETCH,
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av registreringer feilet'
    }
  });
}

export function createEvent(event: Object): Thunk<Promise<?Action>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.CREATE,
        endpoint: '/events/',
        method: 'POST',
        body: event,
        schema: eventSchema,
        disableOptimistic: true,
        meta: {
          errorMessage: 'Opprettelse av hendelse feilet'
        }
      })
    ).then(
      action =>
        action &&
        action.payload &&
        dispatch(push(`/events/${action.payload.result}/`))
    );
}

export function editEvent(event: Object): Thunk<Promise<*>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.EDIT,
        endpoint: `/events/${event.id}/`,
        method: 'PUT',
        body: {
          ...event,
          cover: event.cover || undefined
        },
        meta: {
          errorMessage: 'Endring av hendelse feilet'
        }
      })
    ).then(() => dispatch(push(`/events/${event.id}`)));
}

export function deleteEvent(eventId: number): Thunk<Promise<*>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.DELETE,
        endpoint: `/events/${eventId}/`,
        method: 'DELETE',
        meta: {
          id: eventId,
          errorMessage: 'Sletting av hendelse feilet'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Deleted' }));
      dispatch(push('/events'));
    });
}

export function setCoverPhoto(id: number, token: string) {
  return callAPI({
    types: Event.EDIT,
    endpoint: `/events/${id}/`,
    method: 'PATCH',
    body: {
      id,
      cover: token
    },
    meta: {
      errorMessage: 'Endring av cover bilde feilet'
    }
  });
}

export function register(
  eventId: number,
  captchaResponse: string,
  feedback: string
) {
  return callAPI({
    types: Event.REGISTER,
    endpoint: `/events/${eventId}/registrations/`,
    method: 'POST',
    body: {
      captchaResponse,
      feedback
    },
    meta: {
      id: eventId,
      errorMessage: 'Registering til hendelse feilet'
    }
  });
}

export function unregister(
  eventId: number,
  registrationId: number,
  admin: boolean = false
) {
  return callAPI({
    types: Event.UNREGISTER,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'DELETE',
    body: {},
    meta: {
      errorMessage: 'Avregistrering fra hendelse feilet',
      admin,
      id: Number(registrationId)
    }
  });
}

export function adminRegister(
  eventId: number,
  userId: number,
  poolId?: number,
  feedback: string,
  reason: string
) {
  return callAPI({
    types: Event.ADMIN_REGISTER,
    endpoint: `/events/${eventId}/registrations/admin_register/`,
    method: 'POST',
    body: {
      user: userId,
      pool: poolId,
      feedback,
      admin_reason: reason
    },
    meta: {
      errorMessage: 'Admin registrering feilet'
    }
  });
}

export function payment(eventId: number, token: string) {
  return callAPI({
    types: Event.PAYMENT_QUEUE,
    endpoint: `/events/${eventId}/payment/`,
    method: 'POST',
    body: {
      token
    },
    meta: {
      errorMessage: 'Betaling feilet'
    }
  });
}

export function updateFeedback(
  eventId: number,
  registrationId: number,
  feedback: string
): Thunk<Promise<*>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          feedback
        },
        meta: {
          successMessage: 'Tilbakemelding oppdatert',
          errorMessage: 'Tilbakemelding oppdatering feilet'
        }
      })
    );
}

export function updatePresence(
  eventId: number,
  registrationId: number,
  presence: string
): Thunk<Promise<?Action>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          presence
        },
        meta: {
          errorMessage: 'Tilstedeværelse oppdatering feilet'
        }
      })
    ).then(() => dispatch(addNotification({ message: 'Presence updated' })));
}

export function updatePayment(
  eventId: number,
  registrationId: number,
  chargeStatus: string
): Thunk<Promise<?Action>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          chargeStatus
        },
        meta: {
          errorMessage: 'Oppdatering av betaling feilet'
        }
      })
    ).then(() => dispatch(addNotification({ message: 'Payment updated' })));
}

export function follow(userId: number, eventId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.FOLLOW,
        endpoint: `/followers-event/`,
        method: 'POST',
        body: {
          target: eventId,
          follower: userId
        },
        meta: {
          errorMessage: 'Registering av interesse feilet'
        }
      })
    );
}

export function unfollow(followId: number, eventId: number): Thunk<Promise<*>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.UNFOLLOW,
        endpoint: `/followers-event/${followId}/`,
        method: 'DELETE',
        meta: {
          eventId,
          errorMessage: 'Avregistering fra interesse feilet'
        }
      })
    );
}

export function isUserFollowing(eventId: number, userId: number) {
  return callAPI({
    types: Event.IS_USER_FOLLOWING,
    endpoint: `/followers-event/?target=${eventId}&follower=${userId}`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av hendelse følgere feilet'
    }
  });
}
