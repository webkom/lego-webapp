import { createReducer } from '@reduxjs/toolkit';
import { generateStatuses } from 'app/actions/ActionTypes';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import buildPaginationReducer from 'app/utils/legoAdapter/buildPaginationReducer';

describe('buildPaginationReducer', () => {
  const FETCH = generateStatuses('FETCH');

  const initialState = { paginationNext: {} };
  const initialPaginationState: Pagination = {
    query: {},
    ids: [],
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

  const reducer = createReducer(initialState, (builder) => {
    buildPaginationReducer(builder, [FETCH]);
  });

  const fetchSuccess = {
    type: FETCH.SUCCESS,
    meta: { paginationKey: '/fetch/', query: { title: 'ab' } },
    payload: {
      result: [1, 2, 3],
      next: 'https://lego.abakus.no/fetch?cursor=abc123&title=ab',
    },
  };

  it('should add initial pagination state on fetch begin', () => {
    expect(
      reducer(initialState, {
        type: FETCH.BEGIN,
        meta: { paginationKey: '/fetch/', query: {} },
      })
    ).toEqual(stateWithInitialPagination);
    expect(
      reducer(initialState, {
        type: FETCH.BEGIN,
        meta: { paginationKey: '/fetch/', query: { title: 'ab' } },
      })
    ).toEqual({
      ...initialState,
      paginationNext: {
        '/fetch/': { ...initialPaginationState, query: { title: 'ab' } },
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
      { ...fetchSuccess, payload: { result: [] } }
    );
    expect(newState.paginationNext['/fetch/'].next).toEqual(undefined);
    expect(newState.paginationNext['/fetch/'].hasMore).toEqual(false);
    expect(newState.paginationNext['/fetch/'].previous).toEqual(undefined);
    expect(newState.paginationNext['/fetch/'].hasMoreBackwards).toEqual(false);
  });
  it('should keep initial state if no next or previous urls are provided', () => {
    const newState = reducer(stateWithInitialPagination, {
      type: FETCH.SUCCESS,
      meta: { paginationKey: '/fetch/', query: { title: 'ab' } },
      payload: {
        result: [],
      },
    });
    expect(newState).toEqual(stateWithInitialPagination);
  });
});
