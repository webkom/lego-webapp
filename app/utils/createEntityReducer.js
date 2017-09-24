// @flow

import { get, union } from 'lodash';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';

import type { ActionTypeObject } from 'app/utils/promiseMiddleware';
import type { Reducer } from 'app/types';

type EntityReducerOptions = {
  key: string,
  types: {
    fetch?: ActionTypeObject,
    mutate?: ActionTypeObject
  },
  mutate?: Reducer<*, *>,
  initialState?: Object
};

export function fetching(fetchType?: ActionTypeObject) {
  return (state: any, action: any) => {
    if (!fetchType) {
      return state;
    }

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

export function entities(key: string, fetchType?: ActionTypeObject) {
  return (
    state: any = {
      actionGrant: [],
      byId: {},
      items: []
    },
    action: any
  ) => {
    let result = get(action, ['payload', 'entities', key]);
    let actionGrant = get(action, ['payload', 'actionGrant']);

    if (
      !action.payload ||
      (!result && actionGrant && action.type !== get(fetchType, 'SUCCESS'))
    )
      return state;

    result = result || {};
    actionGrant = actionGrant || [];
    return {
      ...state,
      byId: mergeObjects(state.byId, result),
      items: union(
        state.items,
        Object.keys(result).map(i => parseInt(i, 10) || i)
      ),
      actionGrant: union(state.actionGrant, actionGrant)
    };
  };
}

export function optimistic(mutateType?: ActionTypeObject) {
  return (state: any, action: any) => {
    if (
      !mutateType ||
      ![mutateType.FAILURE, mutateType.SUCCESS].includes(action.type)
    ) {
      return state;
    }

    if (!action.meta.optimisticId) {
      return state;
    }

    return {
      ...state,
      items: state.items.filter(item => item !== action.meta.optimisticId)
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
  const { fetch: fetchType, mutate: mutateType } = types;

  const finalInitialState = {
    actionGrant: [],
    byId: {},
    items: [],
    fetching: false,
    ...initialState
  };

  const reduce = joinReducers(
    fetching(fetchType),
    entities(key, fetchType),
    optimistic(mutateType),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
