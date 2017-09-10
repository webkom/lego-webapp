import { FetchHistory } from 'app/actions/ActionTypes';

export default function fetchHistory(state: State = {}, action: Action) {
  const success = action.meta && action.meta.success;
  switch (action.type) {
    case success: {
      if (!success) {
        return state;
      }
      return {
        ...state,
        [action.meta.endpoint]: Date.now()
      };
    }
    case FetchHistory.SET_HISTORY: {
      return {
        ...state,
        [action.payload]: Date.now()
      };
    }
    default:
      return state;
  }
}
