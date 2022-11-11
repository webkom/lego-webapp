import { push } from 'connected-react-router';
import type { Dateish, EventRegistrationPresence } from 'app/models';
import type { EventEntity } from 'app/reducers/events';
import { addToast } from 'app/reducers/toasts';
import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/Entities';
import type Registration from 'app/store/models/Registration';
import type User from 'app/store/models/User';
import type { RootState } from 'app/store/rootReducer';
import {
  eventSchema,
  eventAdministrateSchema,
  followersEventSchema,
} from 'app/store/schemas';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';
import createQueryString from 'app/utils/createQueryString';
import { Event } from './ActionTypes';

export const waitinglistPoolId = -1;

export const fetchEvent = createLegoApiAction()(
  'Event.FETCH',
  (_, eventId: ID) => ({
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Henting av hendelse feilet',
    },
    propagateError: true,
  })
);

export const fetchPrevious = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Events>
>()('Event.FETCH_PREVIOUS', () => ({
  endpoint: '/events/previous/',
  schema: [eventSchema],
  meta: {
    errorMessage: 'Henting av hendelser feilet',
  },
  propagateError: true,
}));

export const fetchUpcoming = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Events>
>()('Event.FETCH_UPCOMING', () => ({
  endpoint: '/events/upcoming/',
  schema: [eventSchema],
  meta: {
    errorMessage: 'Henting av hendelser feilet',
  },
  propagateError: true,
}));

const getEndpoint = (
  state: RootState,
  loadNextPage: boolean,
  queryString: string
): string => {
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

interface FetchEventListOptions {
  dateAfter?: Dateish;
  dateBefore?: Dateish;
  refresh?: boolean;
  loadNextPage?: boolean;
}

export const fetchList = createLegoApiAction()(
  'Event.FETCH_LIST',
  (
    { getState, dispatch },
    {
      dateAfter,
      dateBefore,
      refresh = false,
      loadNextPage = false,
    }: FetchEventListOptions
  ) => {
    const query = {
      date_after: dateAfter?.toString(),
      date_before: dateBefore?.toString(),
      page_size: dateBefore && dateAfter ? 60 : undefined,
    };

    const queryString = createQueryString(query);
    const endpoint = getEndpoint(getState(), loadNextPage, queryString);

    if (refresh && !loadNextPage) {
      dispatch({
        type: Event.CLEAR,
      });
    }

    return {
      endpoint,
      schema: [eventSchema],
      meta: {
        errorMessage: 'Fetching events failed',
        queryString,
        endpoint,
      },
      useCache: refresh,
      cacheSeconds: Infinity,
      // don't expire cache unless we pass useCache
      propagateError: true,
    };
  }
);

export const fetchAdministrate = createLegoApiAction()(
  'Event.FETCH_ADMINISTRATE',
  (_, eventId: ID) => ({
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av registreringer feilet',
    },
  })
);

export const createEvent = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Events>
>()(
  'Event.CREATE',
  (_, event: EventEntity) => ({
    endpoint: '/events/',
    method: 'POST',
    body: event,
    schema: eventSchema,
    meta: {
      errorMessage: 'Opprettelse av hendelse feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/events/${action.payload.result}/`));
    },
  }
);

export const editEvent = createLegoApiAction()(
  'Event.EDIT',
  (_, event: EventEntity) => ({
    endpoint: `/events/${event.id}/`,
    method: 'PUT',
    body: { ...event, cover: event.cover || undefined },
    meta: {
      eventId: event.id,
      errorMessage: 'Endring av hendelse feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/events/${action.meta.eventId}`));
    },
  }
);

export const deleteEvent = createLegoApiAction()(
  'Event.DELETE',
  (_, eventId: ID) => ({
    endpoint: `/events/${eventId}/`,
    method: 'DELETE',
    meta: {
      id: eventId,
      errorMessage: 'Sletting av hendelse feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(
        addToast({
          message: 'Deleted',
        })
      );
      dispatch(push('/events'));
    },
  }
);

export const setCoverPhoto = createLegoApiAction()(
  'Event.SET_COVER_PHOTO',
  (_, id: ID, token: string) => ({
    endpoint: `/events/${id}/`,
    method: 'PATCH',
    body: {
      id,
      cover: token,
    },
    meta: {
      errorMessage: 'Endring av cover bilde feilet',
    },
  })
);

interface EventRegisterArgs {
  eventId: ID;
  captchaResponse: string;
  feedback: string;
  userId: number;
}

export const register = createLegoApiAction()(
  'Event.REQUEST_REGISTER',
  (_, { eventId, captchaResponse, feedback, userId }: EventRegisterArgs) => ({
    endpoint: `/events/${eventId}/registrations/`,
    method: 'POST',
    body: {
      captchaResponse,
      feedback,
    },
    meta: {
      id: eventId,
      userId,
      errorMessage: 'Registering til hendelse feilet',
    },
  })
);

interface EventUnregisterArgs {
  eventId: ID;
  registrationId: number;
  userId: number;
  admin: boolean;
}

export const unregister = createLegoApiAction()(
  'Event.REQUEST_UNREGISTER',
  (_, { eventId, registrationId, userId, admin }: EventUnregisterArgs) => ({
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'DELETE',
    body: {},
    meta: {
      errorMessage: 'Avregistrering fra hendelse feilet',
      admin,
      userId,
      id: Number(registrationId),
    },
  })
);

export const adminRegister = createLegoApiAction<
  Registration & { user: User }
>()(
  'Event.ADMIN_REGISTER',
  (
    _,
    eventId: ID,
    userId: ID,
    poolId: ID | undefined,
    feedback: string,
    adminRegistrationReason: string
  ) => ({
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
  })
);

export const payment = createLegoApiAction()(
  'Event.PAYMENT_QUEUE',
  (_, eventId: ID) => ({
    endpoint: `/events/${eventId}/payment/`,
    method: 'POST',
    meta: {
      errorMessage: 'Betaling feilet',
    },
  })
);

export const updateFeedback = createLegoApiAction()(
  'Event.UPDATE_FEEDBACK',
  (_, eventId: ID, registrationId: ID, feedback: string) => ({
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      feedback,
    },
    meta: {
      successMessage: 'Tilbakemelding oppdatert',
      errorMessage: 'Tilbakemelding oppdatering feilet',
    },
  })
);

export const markUsernamePresent = createLegoApiAction()(
  'Event.MARK_USERNAME_PRESENT',
  (_, eventId: ID, username: string) => ({
    endpoint: `/events/${eventId}/registration_search/`,
    method: 'POST',
    body: {
      username,
    },
    meta: {
      errorMessage: 'Oppdatering av tilstedeværelse feilet',
    },
  })
);

export const updatePresence = createLegoApiAction()(
  'Event.UPDATE_PRESENCE',
  (
    _,
    eventId: ID,
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => ({
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      presence,
    },
    meta: {
      successMessage: 'Tilstedeværelse oppdatert',
      errorMessage: 'Oppdatering av tilstedeværelse feilet',
    },
  })
);

export const updatePayment = createLegoApiAction()(
  'Event.UPDATE_PAYMENT',
  (_, eventId: ID, registrationId: ID, paymentStatus: string) => ({
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      paymentStatus,
    },
    meta: {
      errorMessage: 'Oppdatering av betaling feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) =>
      dispatch(
        addToast({
          message: 'Payment updated',
        })
      ),
  }
);

export const follow = createLegoApiAction()(
  'Event.FOLLOW',
  (_, userId: ID, eventId: ID) => ({
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
  })
);

export const unfollow = createLegoApiAction()(
  'Event.UNFOLLOW',
  (_, followId: ID) => ({
    endpoint: `/followers-event/${followId}/`,
    enableOptimistic: true,
    method: 'DELETE',
    meta: {
      id: followId,
      errorMessage: 'Avregistering fra interesse feilet',
    },
  })
);

export const isUserFollowing = createLegoApiAction()(
  'Event.IS_USER_FOLLOWING',
  (_, eventId: ID) => ({
    endpoint: `/followers-event/?target=${eventId}`,
    schema: [followersEventSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av interesse feilet',
    },
  })
);
