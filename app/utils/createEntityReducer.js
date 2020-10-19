// @flow

import { omit, without, isArray, get, union, isEmpty } from 'lodash';
import { parse } from 'qs';
import { configWithSSR } from 'app/config';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';

import type { Reducer, AsyncActionType } from 'app/types';

type EntityReducerTypes = AsyncActionType | Array<AsyncActionType>;

type EntityReducerOptions = {
  key: string,
  types: {
    fetch?: EntityReducerTypes,
    mutate?: EntityReducerTypes,
    delete?: EntityReducerTypes,
  },
  mutate?: Reducer,
  initialState?: Object,
};

const defaultState = {
  actionGrant: [],
  pagination: {},
  byId: {},
  items: [],
};

const toArray = <T>(value: ?(T | Array<T>)) => {
  if (!value) {
    return [];
  }
  return isArray(value) ? value : [value];
};

const isNumber = (id) => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

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

export function createAndUpdateEntities(
  fetchTypes: ?EntityReducerTypes,
  key: string
) {
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
      : Object.keys(result).map((i) => (isNumber(i) ? parseInt(i, 10) : i));

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
      !toArray(fetchTypes).some(
        (fetchType) => action.type === fetchType.SUCCESS
      )
    ) {
      return state;
    }

    let pagination = state.pagination;
    const queryString = action.meta && action.meta.queryString;
    if (primaryKey && !action.cached && queryString !== undefined) {
      const nextPage =
        action.payload.next &&
        action.payload.next.replace(configWithSSR.serverUrl, '');
      pagination = {
        ...state.pagination,
        [queryString]: {
          queryString,
          nextPage,
        },
      };
    }
    if (primaryKey && !action.cached && action.meta.paginationKey) {
      pagination = {
        ...state.pagination,
        [action.meta.paginationKey]: {
          ...state.pagination[action.meta.paginationKey],
          items: union(
            state.pagination[action.meta.paginationKey].items,
            resultIds
          ),
        },
      };
    }
    return {
      ...state,
      byId: mergeObjects(state.byId, result),
      items: union(state.items, resultIds),
      actionGrant: union(state.actionGrant, actionGrant),
      pagination,
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
        (deleteType) => action.type === deleteType.SUCCESS
      )
    ) {
      return state;
    }
    const resultId = action.meta && action.meta.id;

    if (!resultId) return state;

    const pagination = Object.keys(state.pagination).reduce(
      (newPagination, key) => {
        const paginationEntry = state.pagination[key];
        if (get(paginationEntry, 'items')) {
          newPagination[key] = {
            ...paginationEntry,
            items: without(
              paginationEntry.items,
              ...(isNumber(resultId)
                ? [Number(resultId), resultId.toString()]
                : [resultId])
            ),
          };
        } else {
          newPagination[key] = paginationEntry;
        }
        return newPagination;
      },
      {}
    );
    return {
      ...state,
      pagination,
      byId: omit(state.byId, resultId),
      items: without(
        state.items,
        ...(isNumber(resultId)
          ? [Number(resultId), resultId.toString()]
          : [resultId])
      ),
    };
  };
}

export function optimistic(mutateTypes: ?EntityReducerTypes) {
  return (state: any, action: any) => {
    if (
      !toArray(mutateTypes).some((mutateType) =>
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
      pagination: {},
      items: state.items.filter((item) => item !== action.meta.optimisticId),
    };
  };
}

// TODO Make this the only spot handling pagination
export function paginationReducer(fetchTypes: ?EntityReducerTypes) {
  return (state: any, action: any) => {
    const paginationKey = get(action, ['meta', 'paginationKey']);
    const cursor = get(action, ['meta', 'cursor']);
    if (
      toArray(fetchTypes).some(
        (fetchType) => action.type === fetchType.BEGIN
      ) &&
      paginationKey &&
      cursor === ''
    ) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [paginationKey]: {
            ...state.pagination[paginationKey],
            items: [],
            hasMore: true,
            next: '',
          },
        },
      };
    }
    if (
      !toArray(fetchTypes).some(
        (fetchType) => action.type === fetchType.SUCCESS
      )
    ) {
      return state;
    }

    if (!action.payload || action.payload.next === undefined) {
      return state;
    }

    const { next = null } = action.payload;
    const parsedNext = next && parse(next.split('?')[1]);
    const hasMore = typeof next === 'string';

    if (paginationKey) {
      return {
        ...state,
        hasMore,
        pagination: {
          ...state.pagination,
          [paginationKey]: {
            ...state.pagination[paginationKey],
            next: parsedNext,
            hasMore,
          },
        },
      };
    }

    return {
      ...state,
      hasMore,
      pagination: {
        ...state.pagination,
        next: parsedNext,
      },
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
  initialState = {},
}: EntityReducerOptions) {
  const finalInitialState = {
    actionGrant: [],
    pagination: {},
    byId: {},
    items: [],
    hasMore: false,
    fetching: false,
    ...initialState,
  };

  const { fetch: fetchTypes, delete: deleteTypes, mutate: mutateTypes } = types;
  const reduce = joinReducers(
    fetching(fetchTypes),
    paginationReducer(fetchTypes),
    createAndUpdateEntities(fetchTypes, key),
    deleteEntities(deleteTypes),
    optimistic(mutateTypes),
    mutate
  );

  return (state: any = finalInitialState, action: any) => reduce(state, action);
}
