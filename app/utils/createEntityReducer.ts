

import { isArray, get, union, isEmpty } from 'lodash';
import { parse } from 'qs';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';

import { Reducer, AsyncActionType } from 'app/types';

type EntityReducerOptions = {
  key: string,
  types: {
    fetch?: ?AsyncActionType | Array<?AsyncActionType>,
    mutate?: ?AsyncActionType
  },
  mutate?: Reducer,
  initialState?: Object
};

export function fetching(fetchType?: ?AsyncActionType) {
  return (state: any = { fetching: false }, action: any) => {
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

const isNumber = id => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

export function entities(key: string, fetchType?: ?AsyncActionType) {
  return (
    state: any = {
      actionGrant: [],
      pagination: {},
      byId: {},
      items: []
    },
    action: any
  ) => {
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
      !action.payload ||
      (isEmpty(result) &&
        !isEmpty(actionGrant) &&
        action.type !== get(fetchType, 'SUCCESS'))
    )
      return state;

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

export function optimistic(mutateType?: ?AsyncActionType) {
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

export function paginationReducer(key: string, fetchType?: ?AsyncActionType) {
  return (state: any, action: any) => {
    if (action.type !== get(fetchType, 'SUCCESS')) {
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
  const { fetch, mutate: mutateType } = types;

  const finalInitialState = {
    actionGrant: [],
    pagination: {},
    byId: {},
    items: [],
    hasMore: false,
    fetching: false,
    ...initialState
  };

  const fetchTypes = isArray(fetch) ? fetch : [fetch];
  const reduce = joinReducers(
    ...fetchTypes.map(fetchType =>
      joinReducers(
        fetching(fetchType),
        entities(key, fetchType),
        paginationReducer(key, fetchType)
      )
    ),
    optimistic(mutateType),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
