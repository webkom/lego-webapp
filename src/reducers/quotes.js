import createReducer from '../utils/createReducer';
import { Quote } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function mergeElements(oldList, newList) {
  const oldListIds = oldList.map(item => item.id);
  const newListIds = newList.map(item => item.id);

  // Replace items in state if there are new versions in payload
  const items = oldList.map(item => {
    if (newListIds.indexOf(item.id) !== -1) {
      return newList[newListIds.indexOf(item.id)];
    }
    return item;
  });

  // Add any new elements
  newList.map(item => {
    if (oldListIds.indexOf(item.id) === -1) {
      items.push(item);
    }
  });

  return items;
}

const handleSuccess = (state, action) => ({
  ...state,
  isFetching: false,
  items: mergeElements(state.items, [action.payload])
});

export default createReducer(initialState, {
  [Quote.FETCH_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_SUCCESS]: handleSuccess,
  [Quote.FETCH_ALL_APPROVED_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_ALL_APPROVED_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_ALL_APPROVED_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: mergeElements(state.items, action.payload) }),
  [Quote.FETCH_ALL_UNAPPROVED_BEGIN]: (state, action) => ({
    ...state, isFetching: true }),
  [Quote.FETCH_ALL_UNAPPROVED_FAILURE]: (state, action) => ({
    ...state, isFetching: false }),
  [Quote.FETCH_ALL_UNAPPROVED_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: mergeElements(state.items, action.payload) }),
  [Quote.LIKE_SUCCESS]: handleSuccess,
  [Quote.UNLIKE_SUCCESS]: handleSuccess,
  [Quote.APPROVE_SUCCESS]: handleSuccess,
  [Quote.UNAPPROVE_SUCCESS]: handleSuccess,
  [Quote.ADD_SUCCESS]: handleSuccess,
  [Quote.DELETE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: state.items.filter(q => action.meta.quoteId !== q.id)
  })
});
