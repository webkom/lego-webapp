// @flow

import { FetchHistory } from 'app/actions/ActionTypes';

type State = {};

const initialState = {};

export default function fetchHistory(state: State = initialState, action: any) {
  const success = action.meta && action.meta.success;
  switch (action.type) {
    case success: {
      if (!success || action.cached) {
        return state;
      }
      return {
        ...state,
        [action.meta.endpoint]: {
          action: {
            ...action,
            cached: true
          },
          timestamp: Date.now()
        }
      };
    }
    case FetchHistory.SET_HISTORY: {
      return {
        ...state,
        [action.payload]: {
          timestamp: Date.now()
        }
      };
    }
    case FetchHistory.CLEAR_HISTORY:
      return initialState;
    default:
      return state;
  }
}
