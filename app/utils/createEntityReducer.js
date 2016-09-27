// @flow

import union from 'lodash/union';
import merge from 'lodash/merge';

type EntityReducerOptions = {
  key: string,
  types: [string, string, string],
  mutate?: () => void,
  initialState?: Object
};

/**
 * Create reducers for common crud actions
 */
export default function createEntityReducer({
  key,
  types,
  mutate,
  initialState = {}
}: EntityReducerOptions) {
  const [fetchType, fetchSuccessType, fetchFailureType] = types;

  function fetching(state: any, action: any) {
    switch (action.type) {
      case fetchType:
        return { ...state, fetching: true };
      case fetchSuccessType:
      case fetchFailureType:
        return { ...state, fetching: false };
      default:
        return state;
    }
  }

  function arrayOf(value) {
    if (Array.isArray(value)) return value;
    return [value];
  }

  function entities(state, action) {
    if (action.payload && action.payload.entities && action.payload.entities[key]) {
      return {
        ...state,
        byId: merge({}, state.byId, action.payload.entities[key]),
        items: union(state.items, arrayOf(action.payload.result))
      };
    }

    return state;
  }

  const finalInitialState = {
    byId: {},
    items: [],
    fetching: false,
    ...initialState
  };

  return function entityReducer(state: any = finalInitialState, action: any) {
    const nextState = fetching(entities(state, action), action);

    if (typeof mutate === 'function') {
      return mutate(nextState, action);
    }

    return nextState;
  };
}
