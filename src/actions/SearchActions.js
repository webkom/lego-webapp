import { Search } from './ActionTypes';

export function clear() {
  return (dispatch, getState) => {
    if (getState().search.closed) return;
    dispatch({ type: Search.CLEAR });
  };
}

export function search(query) {
  return {
    type: Search.SEARCH,
    payload: query
  };
}
