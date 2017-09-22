// @flow

import { eventSchema, eventAdministrateSchema } from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import callAPI from 'app/actions/callAPI';
import { Event } from './ActionTypes';
import { push } from 'react-router-redux';
import { addNotification } from 'app/actions/NotificationActions';

export function fetchEvent(eventId: string) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Fetching event failed'
    },
    propagateError: true
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
    },
    propagateError: true
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

export function createEvent(event: Object) {
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
          errorMessage: 'Creating event failed'
        }
      })
    ).then(res => dispatch(push(`/events/${res.payload.result}/`)));
}

export function editEvent(event: Object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: Event.EDIT,
        endpoint: `/events/${event.id}/`,
        method: 'PUT',
        body: event,
        meta: {
          errorMessage: 'Editing event failed'
        }
      })
    ).then(() => dispatch(push(`/events/${event.id}`)));
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

export function follow(userId, eventId) {
  return dispatch => {
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
          errorMessage: 'Failed to register interest'
        }
      })
    );
  };
}

export function unfollow(followId, eventId) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Event.UNFOLLOW,
        endpoint: `/followers-event/${followId}/`,
        method: 'DELETE',
        meta: {
          eventId,
          errorMessage: 'Failed to unregister interest'
        }
      })
    );
  };
}

export function isUserFollowing(eventId, userId) {
  return callAPI({
    types: Event.IS_USER_FOLLOWING,
    endpoint: `/followers-event/?target=${eventId}&follower=${userId}`,
    method: 'GET',
    meta: {
      errorMessage: 'Failed to get event followers'
    }
  });
}
