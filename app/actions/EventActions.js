import { arrayOf } from 'normalizr';
import { Event } from './ActionTypes';
import { eventSchema } from 'app/reducers';
import { callAPI, createQueryString } from 'app/utils/http';

export function fetchEvent(eventId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: Event.FETCH,
      endpoint: `/events/${eventId}/`,
      schema: eventSchema,
      meta: {
        errorMessage: 'Fetching event failed'
      }
    }));
  };
}

export function fetchAll({ year, month } = {}) {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${createQueryString({ year, month })}`,
    schema: arrayOf(eventSchema),
    meta: {
      errorMessage: 'Fetching events failed'
    }
  });
}
