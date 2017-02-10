// @flow

import { get, union, mergeWith } from 'lodash';
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

export function fetching(fetchType: ActionTypeObject) {
  return (state: any, action: any) => {
    switch (action.type) {
      case fetchType.BEGIN:
        return { ...state, fetching: true };

      case fetchType.SUCCESS:
      case fetchType.FAILURE:
        return { ...state, fetching: false };

      default:
        return state;
    }
  };
}

function arrayOf(value) {
  if (Array.isArray(value)) return value;
  return [value];
}

function merge(old, updated) {
  return mergeWith({}, old, updated, (oldValue, newValue) =>
    (Array.isArray(oldValue) ? newValue : undefined
  ));
}

export function entities(key: string) {
  return (state: any = {
    byId: {},
    items: []
  }, action: any) => {
    const result = get(action, ['payload', 'entities', key]);
    if (!result) {
      return state;
    }

    return {
      ...state,
      byId: merge(state.byId, result),
      items: union(state.items, arrayOf(action.payload.result)),
      actionGrant: action.payload.actionGrant
    };
  };
}

export function optimistic(mutateType: ActionTypeObject) {
  return (state: any, action: any) => {
    if (
      !mutateType ||
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
  };
}

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

  const finalInitialState = {
    byId: {},
    items: [],
    fetching: false,
    ...initialState
  };

  const reduce = joinReducers(
    fetching(fetchType),
    entities(key),
    optimistic(mutateType),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
