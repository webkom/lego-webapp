import createReducer from '../util/createReducer';
import { Quotes } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

export default createReducer(initialState, {
  [Quotes.FETCH_ALL_APPROVED_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Quotes.FETCH_ALL_APPROVED_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Quotes.FETCH_ALL_APPROVED_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload }),
  [Quotes.FETCH_ALL_UNAPPROVED_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Quotes.FETCH_ALL_UNAPPROVED_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Quotes.FETCH_ALL_UNAPPROVED_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload }),
  [Quotes.LIKE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.map(q => !action.payload ? q : (q.id===action.payload.id ? action.payload : q))
  }),
  [Quotes.UNLIKE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.map(q => !action.payload ? q : (q.id===action.payload.id ? action.payload : q))
  }),
  [Quotes.APPROVE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.map(q => !action.payload ? q : (q.id===action.payload.id ? action.payload : q))
  }),
  [Quotes.UNAPPROVE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.map(q => !action.payload ? q : (q.id===action.payload.id ? action.payload : q))
  }),
  [Quotes.DELETE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.filter(q => action.meta.quoteId !== q.id)
  })
});
