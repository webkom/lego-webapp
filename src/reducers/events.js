import createReducer from '../utils/createReducer';
import { Event } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function replaceEvent(events, newEvent) {
  const existing = events.find(event => event.id === newEvent.id);
  if (existing) {
    return events.map(event => event.id === newEvent.id ? newEvent : event);
  }

  return events.concat(newEvent);
}

export default createReducer(initialState, {
  [Event.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Event.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Event.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload }),
  [Event.FETCH_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: replaceEvent(state.items, action.payload)
  })
});
