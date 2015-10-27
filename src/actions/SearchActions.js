import { Search } from './ActionTypes';

function createRandomSearchResults(n) {
  const types = ['article', 'event', 'user', 'interest group'];
  const titles = ['hello world', 'everyone is fired', 'you are a dick', 'lego ruler'];
  return Array(n).fill(0).map(() => ({
    type: types[(Math.random() * types.length) | 0],
    title: titles[(Math.random() * titles.length) | 0]
  }));
}

export function search(query) {
  return (dispatch, getState) => {
    dispatch({
      type: Search.SEARCH,
      payload: query
    });

    setTimeout(() => {
      dispatch({
        type: Search.RESULTS_RECEIVED,
        payload: createRandomSearchResults((Math.random() * 10) | 0)
      });
    }, 1000);
  };
}
