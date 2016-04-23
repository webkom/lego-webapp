import { Search } from './ActionTypes';
import { callAPI } from 'app/utils/http';
import { catchErrorAsNotification } from './NotificationActions';

export function search(query) {
  return (dispatch) => {
    dispatch(callAPI({
      endpoint: `/search/${query}`,
      types: [Search.SEARCH_BEGIN, Search.SEARCH_SUCCESS, Search.SEARCH_FAILURE],
      meta: {
        query
      }
    })).catch(catchErrorAsNotification(dispatch, 'Search failed'));
  };
}
