import { createReducer } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';

describe('buildPaginationReducer', () => {
  const FETCH = generateStatuses('FETCH');

  const initialState = { paginationNext: {} };
  const initialPaginationState: Pagination = {
    query: {},
    ids: [],
    fetching: false,
    hasMore: false,
    hasMoreBackwards: false,
    next: undefined,
    previous: undefined,
  };
  const stateWithInitialPagination = {
    ...initialState,
    paginationNext: {
      '/fetch/': initialPaginationState,
    },
  };
  const stateWithFetchingPagination = produce(
    stateWithInitialPagination,
    (draft) => {
      draft.paginationNext['/fetch/'].fetching = true;
    },
  );

  const reducer = createReducer(initialState, (builder) => {
    buildPaginationReducer(builder, [FETCH]);
  });

  const fetchSuccess = {
    type: FETCH.SUCCESS,
    meta: {
      endpoint: '/fetch',
      paginationKey: '/fetch/',
      query: { title: 'ab' },
    },
    payload: {
      result: [1, 2, 3],
      next: 'https://lego.abakus.no/fetch?cursor=abc123&title=ab',
    },
  };

  it('should add initial pagination state on fetch begin', () => {
    expect(
      reducer(initialState, {
        type: FETCH.BEGIN,
        meta: { endpoint: '/fetch', paginationKey: '/fetch/', query: {} },
      }),
    ).toEqual(stateWithFetchingPagination);
    expect(
      reducer(initialState, {
        type: FETCH.BEGIN,
        meta: {
          endpoint: '/fetch',
          paginationKey: '/fetch/',
          query: { title: 'ab' },
        },
      }),
    ).toEqual({
      ...initialState,
      paginationNext: {
        '/fetch/': {
          ...initialPaginationState,
          fetching: true,
          query: { title: 'ab' },
        },
      },
    });
  });
  it('should update ids on fetch success', () => {
    const newState = reducer(stateWithInitialPagination, fetchSuccess);
    expect(newState.paginationNext['/fetch/'].ids).toEqual([1, 2, 3]);
  });
  it('should update state if "next" set in the fetch success action', () => {
    const newState = reducer(stateWithInitialPagination, fetchSuccess);
    expect(newState.paginationNext['/fetch/'].next).toEqual({
      title: 'ab',
      cursor: 'abc123',
    });
    expect(newState.paginationNext['/fetch/'].hasMore).toEqual(true);
  });
  it('should update state if "previous" set in the fetch success action', () => {
    const newState = reducer(stateWithInitialPagination, {
      ...fetchSuccess,
      payload: {
        result: [1],
        previous: 'http://lego.abakus.no/fetch?cursor=test&title=ab',
      },
    });
    expect(newState.paginationNext['/fetch/'].previous).toEqual({
      title: 'ab',
      cursor: 'test',
    });
    expect(newState.paginationNext['/fetch/'].hasMoreBackwards).toEqual(true);
  });
  it('should remove next/previous if a fetch success action does not have them', () => {
    const newState = reducer(
      {
        ...stateWithInitialPagination,
        paginationNext: {
          '/fetch/': {
            ...initialPaginationState,
            next: {
              cursor: 123,
            },
            previous: {
              cursor: 321,
            },
          },
        },
      },
      { ...fetchSuccess, payload: { result: [] } },
    );
    expect(newState.paginationNext['/fetch/'].next).toEqual(undefined);
    expect(newState.paginationNext['/fetch/'].hasMore).toEqual(false);
    expect(newState.paginationNext['/fetch/'].previous).toEqual(undefined);
    expect(newState.paginationNext['/fetch/'].hasMoreBackwards).toEqual(false);
  });
  it('should keep initial state if no next or previous urls are provided', () => {
    const newState = reducer(stateWithInitialPagination, {
      type: FETCH.SUCCESS,
      meta: {
        endpoint: '/fetch',
        paginationKey: '/fetch/',
        query: { title: 'ab' },
      },
      payload: {
        result: [],
      },
    });
    expect(newState).toEqual(stateWithInitialPagination);
  });
  it('should update fetching state on fetch begin', () => {
    const newState = reducer(stateWithInitialPagination, {
      type: FETCH.BEGIN,
      meta: { endpoint: '/fetch', paginationKey: '/fetch/', query: {} },
    });
    expect(newState.paginationNext['/fetch/'].fetching).toEqual(true);
  });
  it('should update fetching state on fetch failure', () => {
    stateWithInitialPagination.paginationNext['/fetch/'].fetching = true;
    const newState = reducer(stateWithFetchingPagination, {
      type: FETCH.FAILURE,
      meta: { endpoint: '/fetch', paginationKey: '/fetch/', query: {} },
    });
    expect(newState.paginationNext['/fetch/'].fetching).toEqual(false);
  });
  it('should update fetching state on fetch success', () => {
    const newState = reducer(stateWithFetchingPagination, fetchSuccess);
    expect(newState.paginationNext['/fetch/'].fetching).toEqual(false);
  });
});
