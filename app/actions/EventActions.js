// @flow

import { eventSchema, eventAdministrateSchema } from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import callAPI from 'app/actions/callAPI';
import { Event } from './ActionTypes';
import { push } from 'react-router-redux';
import { addNotification } from 'app/actions/NotificationActions';
import moment from 'moment';

export function fetchEvent(eventId: string) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Fetching event failed'
    }
  });
}

export function fetchAll({ dateAfter, dateBefore }: Object = {}) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${createQueryString({
      date_after: dateAfter,
      date_before: dateBefore
    })}`,
    schema: [eventSchema],
    meta: {
      errorMessage: 'Fetching events failed'
    }
  });
}

export function fetchAdministrate(eventId: string) {
  return callAPI({
    types: Event.ADMINISTRATE_FETCH,
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Fetching registrations failed'
    }
  });
}

export function createEvent({
  title,
  cover,
  startTime,
  endTime,
  description,
  text,
  eventType,
  company,
  location,
  isPriced,
  useStripe,
  priceMember,
  mergeTime,
  useCaptcha,
  tags
}: Object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.CREATE,
        endpoint: '/events/',
        method: 'POST',
        body: {
          title,
          cover,
          startTime: moment(startTime).toISOString(),
          endTime: moment(endTime).toISOString(),
          description,
          text,
          eventType,
          company: company.value,
          location,
          isPriced,
          useStripe,
          priceMember: isPriced ? priceMember * 100 : 0,
          mergeTime: moment(mergeTime).toISOString(),
          useCaptcha,
          tags
        },
        schema: eventSchema,
        meta: {
          errorMessage: 'Creating event failed'
        }
      })
    ).then(res => dispatch(push(`/events/${res.payload.result}/`)));
}

export function editEvent({
  id,
  title,
  startTime,
  endTime,
  description,
  text,
  eventType,
  company,
  location,
  isPriced,
  useStripe,
  priceMember,
  mergeTime,
  useCaptcha,
  tags,
  pools
}: Object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.EDIT,
        endpoint: `/events/${id}/`,
        method: 'PUT',
        body: {
          id,
          title,
          startTime: moment(startTime).toISOString(),
          endTime: moment(endTime).toISOString(),
          description,
          text,
          eventType,
          company: company.value,
          location,
          isPriced,
          useStripe,
          priceMember: isPriced ? priceMember * 100 : 0,
          mergeTime: moment(mergeTime).toISOString(),
          useCaptcha,
          tags,
          pools: pools.map(pool => ({
            ...pool,
            permissionGroups: pool.permissionGroups.map(group => group.value)
          }))
        },
        meta: {
          errorMessage: 'Editing event failed'
        }
      })
    ).then(() => dispatch(push(`/events/${id}`)));
}

export function deleteEvent(eventId) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Event.DELETE,
        endpoint: `/events/${eventId}/`,
        method: 'DELETE',
        meta: {
          id: eventId,
          errorMessage: 'Deleting event failed'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Deleted' }));
      dispatch(push('/events'));
    });
  };
}

export function setCoverPhoto(id, token) {
  return callAPI({
    types: Event.EDIT,
    endpoint: `/events/${id}/`,
    method: 'PATCH',
    body: {
      id,
      cover: token
    },
    meta: {
      errorMessage: 'Editing cover photo failed'
    }
  });
}

export function register(eventId, captchaResponse, feedback) {
  return callAPI({
    types: Event.REGISTER,
    endpoint: `/events/${eventId}/registrations/`,
    method: 'post',
    body: {
      captchaResponse,
      feedback
    },
    meta: {
      id: eventId,
      errorMessage: 'Registering to event failed'
    }
  });
}

export function unregister(eventId, registrationId, admin = false) {
  return callAPI({
    types: Event.UNREGISTER,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'delete',
    body: {},
    meta: {
      errorMessage: 'Unregistering from event failed',
      admin,
      id: Number(registrationId)
    }
  });
}

export function adminRegister(eventId, user, pool, feedback, reason) {
  return callAPI({
    types: Event.ADMIN_REGISTER,
    endpoint: `/events/${eventId}/registrations/admin_register/`,
    method: 'post',
    body: {
      user,
      pool,
      feedback,
      admin_reason: reason
    },
    meta: {
      errorMessage: 'Admin register failed'
    }
  });
}

export function payment(eventId, token) {
  return callAPI({
    types: Event.PAYMENT_QUEUE,
    endpoint: `/events/${eventId}/payment/`,
    method: 'post',
    body: {
      token
    },
    meta: {
      errorMessage: 'Payment failed'
    }
  });
}

export function updateFeedback(eventId, registrationId, feedback) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          feedback
        },
        meta: {
          errorMessage: 'Feedback update failed'
        }
      })
    ).then(() => dispatch(addNotification({ message: 'Feedback updated' })));
  };
}

export function updatePresence(eventId, registrationId, presence) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          presence
        },
        meta: {
          errorMessage: 'Presence update failed'
        }
      })
    ).then(() => dispatch(addNotification({ message: 'Presence updated' })));
  };
}

export function updatePayment(eventId, registrationId, chargeStatus) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          chargeStatus
        },
        meta: {
          errorMessage: 'Presence update failed'
        }
      })
    ).then(() => dispatch(addNotification({ message: 'Payment updated' })));
  };
}
