import { Search } from './ActionTypes';

function createRandomSearchResults(n, timeout = 0) {
  return new Promise( (resolve, reject) => {
    const types = ['article', 'event', 'user', 'interest group'];
    const titles = ['hello world', 'everyone is fired', 'you are a dick', 'lego ruler'];
    setTimeout(() => resolve(Array(n).fill(0).map(() => ({
      type: types[(Math.random() * types.length) | 0],
      title: titles[(Math.random() * titles.length) | 0]
    }))), timeout);
  });
}

export function search(query) {
  return {
    promise: createRandomSearchResults((Math.random() * 10) | 0, 1000),
    types: {
      begin: Search.SEARCH_BEGIN,
      success: [
        Search.SEARCH_SUCCESS,
        (res) => {console.log(res);}
      ],
      failure: Search.SEARCH_FAILURE
    },
    meta: {
      query
    }
  };
}
