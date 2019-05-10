// @flow

import { omit, without, isArray, get, union, isEmpty } from 'lodash';
import { parse } from 'qs';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';

import type { Reducer, AsyncActionType } from 'app/types';

type EntityReducerTypes = AsyncActionType | Array<AsyncActionType>;

type EntityReducerOptions = {
  key: string,
  types: {
    fetch?: EntityReducerTypes,
    mutate?: EntityReducerTypes,
    delete?: EntityReducerTypes
  },
  mutate?: Reducer,
  initialState?: Object
};

const defaultState = {
  actionGrant: [],
  pagination: {},
  byId: {},
  items: []
};

const toArray = <T>(value: ?(T | Array<T>)) => {
  if (!value) {
    return [];
  }
  return isArray(value) ? value : [value];
};

const isNumber = id => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

export function fetching(fetchTypes: ?EntityReducerTypes) {
  return (state: any = { fetching: false }, action: any) => {
    for (const fetchType of toArray(fetchTypes)) {
      switch (action.type) {
        case fetchType.BEGIN:
          return { ...state, fetching: true };

        case fetchType.SUCCESS:
        case fetchType.FAILURE:
          return { ...state, fetching: false };
      }
    }

    return state;
  };
}

export function updateEntities(fetchTypes: ?EntityReducerTypes, key: string) {
  return (state: any = defaultState, action: any) => {
    if (!action.payload) return state;
    const primaryKey = get(action, ['meta', 'schemaKey']) === key;
    const result = get(action, ['payload', 'entities', key], {});

    /*
     * primaryKey is true if the action schema key is the same as the key specified by createEntityReducer.
     * Ex: Article.FETCH.SUCCESS fetches articles, the payload.result is used rather
     * than looping over the object keys for ordering purposes.
     */
    let resultIds = primaryKey
      ? get(action, ['payload', 'result'], [])
      : Object.keys(result).map(i => (isNumber(i) ? parseInt(i, 10) : i));

    const actionGrant =
      primaryKey && isArray(resultIds)
        ? get(action, ['payload', 'actionGrant'], [])
        : [];

    if (!isArray(resultIds)) {
      resultIds = [resultIds];
    }

    if (
      isEmpty(result) &&
      !isEmpty(actionGrant) &&
      !toArray(fetchTypes).some(fetchType => action.type === fetchType.SUCCESS)
    ) {
      return state;
    }

    let pagination = state.pagination;
    const queryString = action.meta && action.meta.queryString;
    if (!action.cached && queryString !== undefined) {
      pagination = {
        ...state.pagination,
        [queryString]: {
          queryString,
          nextPage: action.payload.next
        }
      };
    }
    return {
      ...state,
      byId: mergeObjects(state.byId, result),
      items: union(state.items, resultIds),
      actionGrant: union(state.actionGrant, actionGrant),
      pagination
    };
  };
}

/* This part of CER will handle deletion of values of a given entity.
 * For actions of the type given into `types.delete` when setting up CER will be deleted.
 *
 * Make sure to set `meta.id` in the action.
 */
export function deleteEntities(deleteTypes: ?EntityReducerTypes) {
  return (state: any = defaultState, action: any) => {
    if (
      !toArray(deleteTypes).some(
        deleteType => action.type === deleteType.SUCCESS
      )
    ) {
      return state;
    }
    const resultId = action.meta && action.meta.id;

    if (!resultId) return state;

    return {
      ...state,
      byId: omit(state.byId, resultId),
      items: without(
        state.items,
        ...(isNumber(resultId)
          ? [Number(resultId), resultId.toString()]
          : [resultId])
      )
    };
  };
}

export function optimistic(mutateTypes: ?EntityReducerTypes) {
  return (state: any, action: any) => {
    if (
      !toArray(mutateTypes).some(mutateType =>
        [mutateType.FAILURE, mutateType.SUCCESS].includes(action.type)
      )
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

export function paginationReducer(fetchTypes: ?EntityReducerTypes) {
  return (state: any, action: any) => {
    if (
      !toArray(fetchTypes).some(fetchType => action.type === fetchType.SUCCESS)
    ) {
      return state;
    }

    if (!action.payload || action.payload.next === undefined) {
      return state;
    }
    const paginationKey = get(action, ['meta', 'paginationKey']);

    const { next = null } = action.payload;
    const parsedNext = next && parse(next.split('?')[1]);

    if (paginationKey) {
      state.pagination = {
        ...state.pagination,
        [paginationKey]: {
          ...state.pagination[paginationKey],
          next: parsedNext,
          hasMore: typeof next === 'string'
        }
      };
    } else {
      state.pagination.next = parsedNext;
    }

    return {
      ...state,
      hasMore: typeof next === 'string'
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
  const finalInitialState = {
    actionGrant: [],
    pagination: {},
    byId: {},
    items: [],
    hasMore: false,
    fetching: false,
    ...initialState
  };

  const { fetch: fetchTypes, delete: deleteTypes, mutate: mutateTypes } = types;
  const reduce = joinReducers(
    fetching(fetchTypes),
    updateEntities(fetchTypes, key),
    paginationReducer(fetchTypes),
    deleteEntities(deleteTypes),
    optimistic(mutateTypes),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
