import { arrayOf } from 'normalizr';
import { Event } from './ActionTypes';
import { eventSchema } from 'app/reducers';
import { callAPI, createQueryString } from 'app/utils/http';
import { catchErrorAsNotification } from './NotificationActions';

export function fetchEvent(eventId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Event.FETCH_BEGIN,
        Event.FETCH_SUCCESS,
        Event.FETCH_FAILURE
      ],
      endpoint: `/events/${eventId}/`,
      schema: eventSchema
    })).catch(catchErrorAsNotification(dispatch, 'Fetching event failed'));
  };
}

export function fetchAll({ year, month } = {}) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Event.FETCH_BEGIN,
        Event.FETCH_SUCCESS,
        Event.FETCH_FAILURE
      ],
      endpoint: `/events/${createQueryString({ year, month })}`,
      schema: arrayOf(eventSchema)
    })).catch(catchErrorAsNotification(dispatch, 'Fetching events failed'));
  };
}
