import { produce } from 'immer';
import { omit, without, isArray, get, union, isEmpty } from 'lodash';
import { parse } from 'qs';
import { configWithSSR } from 'app/config';
import joinReducers from 'app/utils/joinReducers';
import mergeObjects from 'app/utils/mergeObjects';
import type { EntityId } from '@reduxjs/toolkit';
import type { Reducer, AsyncActionType } from 'app/types';
import type { StrictReducer } from 'app/utils/joinReducers';
import type { AnyAction } from 'redux';

export type EntityReducerTypes = AsyncActionType | Array<AsyncActionType>;
type EntityReducerOptions<
  State extends EntityReducerState,
  Key extends string,
> = {
  key: Key;
  types: {
    fetch?: EntityReducerTypes;
    mutate?: EntityReducerTypes;
    delete?: EntityReducerTypes;
  };
  mutate?: StrictReducer<State, AnyAction>;
  initialState?: State;
};

const defaultState = {
  actionGrant: [],
  pagination: {},
  paginationNext: {},
  byId: {},
  items: [],
  fetching: false,
};

type Pagination = {
  next?: string;
};

type PaginationCursor = Record<string, string> & { cursor: string };

type PaginationNext = {
  [query: string]: {
    items: EntityId[];
    hasMore: boolean;
    query: Record<string, string>;
    hasMoreBackwards: boolean;
    next: PaginationCursor;
    previous: PaginationCursor;
  };
};

// TODO FIXME Validate what should be Optional here and what should always be the base state
export type EntityReducerState<T = any> = {
  actionGrant: string[];
  pagination: Pagination;
  paginationNext: PaginationNext;
  byId: Record<EntityId, T>;
  items: EntityId[];
  fetching: boolean;
  hasMore?: boolean;
};

const toArray = (
  value: EntityReducerTypes | null | undefined,
): AsyncActionType[] => {
  if (!value) {
    return [];
  }

  return isArray(value) ? value : [value];
};

const isNumber = (id) => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

type FetchingState = {
  fetching: boolean;
};

export function fetching<State extends FetchingState>(
  fetchTypes: EntityReducerTypes | null | undefined,
): StrictReducer<State> {
  return (state = { fetching: false } as State, action) => {
    for (const fetchType of toArray(fetchTypes)) {
      switch (action.type) {
        case fetchType.BEGIN:
          return { ...state, fetching: true };

        case fetchType.SUCCESS:
        case fetchType.FAILURE:
          return { ...state, fetching: false };

        default:
          break;
      }
    }

    return state;
  };
}
export function createAndUpdateEntities(
  fetchTypes: EntityReducerTypes | null | undefined,
  key: string,
): Reducer {
  return (state = defaultState, action) => {
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
        (fetchType) => action.type === fetchType.SUCCESS,
      )
    ) {
      return state;
    }

    let pagination = state.pagination;
    const queryString = action.meta && action.meta.queryString;

    if (primaryKey && queryString !== undefined) {
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

    let paginationNext = state.paginationNext;

    if (primaryKey && action.meta.paginationKey) {
      paginationNext = {
        ...state.paginationNext,
        [action.meta.paginationKey]: {
          ...state.paginationNext[action.meta.paginationKey],
          items: union(
            state.paginationNext[action.meta.paginationKey].items,
            resultIds,
          ),
        },
      };
    }

    return produce(state, (draft) => {
      if (result && !isEmpty(result)) {
        draft.byId = mergeObjects(state.byId, result);
      }
      draft.items = union(state.items, resultIds);
      draft.actionGrant = union(state.actionGrant, actionGrant);
      draft.pagination = pagination;
      draft.paginationNext = paginationNext;
    });
  };
}

/* This part of CER will handle deletion of values of a given entity.
 * For actions of the type given into `types.delete` when setting up CER will be deleted.
 *
 * Make sure to set `meta.id` in the action.
 */
export function deleteEntities(
  deleteTypes: EntityReducerTypes | null | undefined,
): Reducer {
  return (state = defaultState, action) => {
    if (
      !toArray(deleteTypes).some(
        (deleteType) => action.type === deleteType.SUCCESS,
      )
    ) {
      return state;
    }

    const resultId = action.meta && action.meta.id;
    if (!resultId) return state;
    const paginationNext = Object.keys(state.paginationNext).reduce(
      (newPaginationNext, key) => {
        newPaginationNext[key] = {
          ...state.paginationNext[key],
          items: without(
            state.paginationNext[key].items,
            ...(isNumber(resultId)
              ? [Number(resultId), resultId.toString()]
              : [resultId]),
          ),
        };
        return newPaginationNext;
      },
      {},
    );
    return {
      ...state,
      paginationNext,
      byId: omit(state.byId, resultId),
      items: without(
        state.items,
        ...(isNumber(resultId)
          ? [Number(resultId), resultId.toString()]
          : [resultId]),
      ),
    };
  };
}
export function optimisticDelete(
  deleteTypes: EntityReducerTypes | null | undefined,
): Reducer {
  return (state, action) => {
    if (!deleteTypes || !action.meta || !action.meta.enableOptimistic) {
      return state;
    }

    if (
      toArray(deleteTypes).some(
        (deleteType) => action.type === deleteType.BEGIN,
      )
    ) {
      return {
        ...state,
        items: state.items.filter((item) => item !== action.meta.id),
      };
    }

    if (
      toArray(deleteTypes).some(
        (deleteType) => action.type === deleteType.FAILURE,
      )
    ) {
      return { ...state, items: state.items.concat(action.meta.id) };
    }

    return state;
  };
}
export function optimistic(
  mutateTypes: EntityReducerTypes | null | undefined,
): Reducer {
  return (state, action) => {
    if (
      !toArray(mutateTypes).some((mutateType) =>
        [mutateType.FAILURE, mutateType.SUCCESS].includes(action.type),
      )
    ) {
      return state;
    }

    return {
      ...state,
      paginationNext: {},
      items: state.items.filter((item) => item !== action.meta.optimisticId),
    };
  };
}
// TODO Make this the only spot handling pagination
export function paginationReducer(
  fetchTypes: EntityReducerTypes | null | undefined,
): Reducer {
  return (state, action) => {
    const paginationKey = get(action, ['meta', 'paginationKey']);
    const cursor = get(action, ['meta', 'cursor']);
    const query = get(action, ['meta', 'query']);

    if (
      toArray(fetchTypes).some(
        (fetchType) => action.type === fetchType.BEGIN,
      ) &&
      paginationKey &&
      cursor === ''
    ) {
      return {
        ...state,
        paginationNext: {
          ...state.paginationNext,
          [paginationKey]: {
            ...state.paginationNext[paginationKey],
            items: [],
            hasMore: true,
            query,
            hasMoreBackwards: false,
            next: { ...query, cursor: '' },
            previous: null,
          },
        },
      };
    }

    if (
      !toArray(fetchTypes).some(
        (fetchType) => action.type === fetchType.SUCCESS,
      )
    ) {
      return state;
    }

    if (!action.payload || action.payload.next === undefined) {
      return state;
    }

    const { next = null, previous = null } = action.payload;
    const parsedNext = next && parse(next.split('?')[1]);
    const parsedPrevious = previous && parse(previous.split('?')[1]);
    const hasMore = typeof next === 'string';
    const hasMoreBackwards = typeof previous === 'string';

    if (paginationKey) {
      return {
        ...state,
        hasMore,
        paginationNext: {
          ...state.paginationNext,
          [paginationKey]: {
            items: [],
            ...state.paginationNext[paginationKey],
            query,
            next: parsedNext,
            previous: parsedPrevious,
            hasMore,
            hasMoreBackwards,
          },
        },
      };
    }

    return {
      ...state,
      hasMore,
      pagination: { ...state.pagination, next: parsedNext },
    };
  };
}
/**
 * Create reducers for common crud actions
 */

export default function createEntityReducer<
  Entity = EntityReducerState,
  Key extends string = string,
>({
  key,
  types,
  mutate,
  initialState,
}: EntityReducerOptions<EntityReducerState<Entity>, Key>) {
  type State = EntityReducerState<Entity>;
  const finalInitialState: State = {
    actionGrant: [],
    pagination: {},
    paginationNext: {},
    byId: {},
    items: [],
    hasMore: false,
    fetching: false,
    ...initialState,
  };
  const { fetch: fetchTypes, delete: deleteTypes, mutate: mutateTypes } = types;
  const reduce = joinReducers<State>(
    fetching(fetchTypes),
    paginationReducer(fetchTypes),
    createAndUpdateEntities(fetchTypes, key),
    deleteEntities(deleteTypes),
    optimistic(mutateTypes),
    optimisticDelete(deleteTypes),
    mutate,
  );
  return (state = finalInitialState, action) => reduce(state, action);
}
