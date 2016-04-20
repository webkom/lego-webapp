import createReducer from '../utils/createReducer';
import { Event, Comment } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function replaceEvent(events, newEvent) {
  const existing = events.find((event) => event.id === newEvent.id);
  if (existing) {
    return events.map((event) => event.id === newEvent.id ? newEvent : event);
  }

  return events.concat(newEvent);
}

function addComment(state, action) {
  const [sourceType, objectId] = action.meta.commentTarget.split('-');
  if (sourceType === 'events') {
    return {
      ...state,
      items: state.items.map((evt) => {
        if (evt.id !== parseInt(objectId, 10)) {
          return evt;
        }
        return {
          ...evt,
          comments: [
            ...evt.comments,
            action.payload
          ]
        };
      })
    };
  }
  return state;
}

export default createReducer(initialState, {
  [Event.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Event.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Event.FETCH_ALL_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: action.payload
  }),
  [Event.FETCH_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: replaceEvent(state.items, action.payload)
  }),
  [Comment.ADD_SUCCESS]: addComment
});
