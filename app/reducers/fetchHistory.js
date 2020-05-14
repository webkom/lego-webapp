// @flow

import { FetchHistory, User } from 'app/actions/ActionTypes';

type State = {};

const initialState = {};

export default function fetchHistory(state: State = initialState, action: any) {
  const success = action.meta && action.meta.success;
  switch (action.type) {
    case success: {
      // We only want to cache on the server-side, to avoid having to redo all
      // the requests during the initial render. Caching on the client is sort
      // of annoying, as it creates a lot of weird issues.
      if (!success || action.cached || __CLIENT__) return state;
      return {
        ...state,
        [action.meta.endpoint]: {
          action: {
            ...action,
            cached: true,
          },
          timestamp: Date.now(),
        },
      };
    }
    case FetchHistory.CLEAR_HISTORY:
    case User.LOGIN.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
