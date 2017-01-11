// @flow

import { get, defaults, assign, union } from 'lodash';
import joinReducers from 'app/utils/joinReducers';

import type { ActionTypeObject } from 'app/utils/promiseMiddleware';

type EntityReducerOptions = {
  key: string,
  types: {
    fetch: ActionTypeObject,
    mutate?: ActionTypeObject,
  },
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
  const {
    fetch: fetchType,
    mutate: mutateType
  } = types;

  function fetching(state: any, action: any) {
    switch (action.type) {
      case fetchType.BEGIN:
        return { ...state, fetching: true };

      case fetchType.SUCCESS:
      case fetchType.FAILURE:
        return { ...state, fetching: false };

      default:
        return state;
    }
  }

  function arrayOf(value) {
    if (Array.isArray(value)) return value;
    return [value];
  }

  function entities(state: any, action) {
    const result = get(action, ['payload', 'entities', key]);
    if (!result) return state;
    // for list results we don't want to override existing data:
    const func = Array.isArray(action.payload.result) ? defaults : assign;
    return {
      ...state,
      byId: func({}, state.byId, result),
      items: union(state.items, arrayOf(action.payload.result))
    };
  }

  function optimistic(state: any, action) {
    if (!mutateType ||
      ![mutateType.FAILURE, mutateType.SUCCESS].includes(action.type)) {
      return state;
    }

    if (!action.meta.optimisticId) {
      return state;
    }

    return {
      ...state,
      items: state.items.filter((item) => item !== action.meta.optimisticId)
    };
  }

  const finalInitialState = {
    byId: {},
    items: [],
    fetching: false,
    ...initialState
  };

  const reduce = joinReducers(
    fetching,
    entities,
    optimistic,
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
