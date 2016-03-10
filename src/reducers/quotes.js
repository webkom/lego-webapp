import createReducer from '../utils/createReducer';
import { Quote } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function handleSuccess(state, action) {
  let added = false;
  const newState = {
    ...state,
    isFetching: false,
    items: state.items.map(item => {
      if (item.id === action.payload.id) {
        added = true;
        return action.payload;
      }
      return item;
    })
  };
  if (!added) {
    newState.items.push(action.payload);
  }
  return newState;
}

const approvalSuccess = (state, action) => ({
  ...state,
  isFetching: false,
  items: state.items.filter(item => item.id !== action.payload.id)
});

export default createReducer(initialState, {
  [Quote.FETCH_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: [action.payload] }),
  [Quote.FETCH_ALL_APPROVED_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_ALL_APPROVED_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_ALL_APPROVED_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: action.payload }),
  [Quote.FETCH_ALL_UNAPPROVED_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_ALL_UNAPPROVED_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_ALL_UNAPPROVED_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: action.payload }),
  [Quote.LIKE_SUCCESS]: handleSuccess,
  [Quote.UNLIKE_SUCCESS]: handleSuccess,
  [Quote.APPROVE_SUCCESS]: approvalSuccess,
  [Quote.UNAPPROVE_SUCCESS]: approvalSuccess,
  [Quote.ADD_SUCCESS]: handleSuccess,
  [Quote.DELETE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.filter(q => action.meta.quoteId !== q.id)
  })
});
