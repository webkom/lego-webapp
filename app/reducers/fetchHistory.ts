import { omit } from 'lodash';
import { FetchHistory, User } from 'app/actions/ActionTypes';

type State = unknown;
const initialState = {};
export const fetchHistoryEntryKey = (
  meta: {
    paginationKey: string;
    cursor: string;
    endpoint: string;
  } // Add random (but stable) string before endpoint so that we don't mix actions with paginationKey and those without
) =>
  meta &&
  (meta.paginationKey
    ? 'paginationKeyAndCursor:' + meta.paginationKey + '&cursor=' + meta.cursor
    : meta.endpoint);
export default function fetchHistory(state: State = initialState, action: any) {
  const success = action.meta && action.meta.success;

  switch (action.type) {
    case success: {
      const key = fetchHistoryEntryKey(action.meta);
      // We only want to cache on the server-side, to avoid having to redo all
      // the requests during the initial render. Caching on the client is sort
      // of annoying, as it creates a lot of weird issues.
      if (!success || typeof key !== 'string') return state;

      if (__CLIENT__) {
        if (state[key]) {
          const newState = {
            ...state,
            [key]: { ...state[key], cacheCounter: state[key].cacheCounter + 1 },
          };

          // Evict cache if it is used 3 or more times
          // This is due to some behavior that runs the same action multiple times during first render on the client
          if (newState[key].cacheCounter >= 3) {
            return omit(state, key);
          }

          return newState;
        }

        return state;
      }

      if (action.cached) return state;
      return {
        ...state,
        [key]: {
          action: { ...action, cached: true },
          cacheCounter: 0,
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
