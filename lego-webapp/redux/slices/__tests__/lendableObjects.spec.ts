import { describe, expect, it } from 'vitest';
import { LendableObjects } from '~/redux/actionTypes';
import { createRootReducer } from '~/redux/rootReducer';
import lendableObjects, {
  selectLendableObjectsUnavailable,
} from '../lendableObjects';

const rootReducer = createRootReducer();

describe('lendableObjects', () => {
  it('marks lending objects as unavailable when fetching objects fails', () => {
    const state = lendableObjects(undefined, {
      type: LendableObjects.FETCH.FAILURE,
    });

    expect(state.fetchFailed).toBe(true);
  });

  it('marks lending objects as unavailable when fetching availability fails', () => {
    const state = lendableObjects(undefined, {
      type: LendableObjects.FETCH_AVAILABLE.FAILURE,
    });

    expect(state.availabilityFetchFailed).toBe(true);
  });

  it('resets unavailable when lending objects are fetched again', () => {
    const failedState = lendableObjects(undefined, {
      type: LendableObjects.FETCH.FAILURE,
    });
    const state = lendableObjects(failedState, {
      type: LendableObjects.FETCH.SUCCESS,
      payload: {
        entities: {},
        result: [],
      },
      meta: {},
    });

    expect(state.fetchFailed).toBe(false);
  });

  it('does not hide object fetch failures when availability succeeds', () => {
    const failedState = lendableObjects(undefined, {
      type: LendableObjects.FETCH.FAILURE,
    });
    const state = lendableObjects(failedState, {
      type: LendableObjects.FETCH_AVAILABLE.SUCCESS,
      payload: [],
    });

    expect(state.fetchFailed).toBe(true);
  });

  it('selects whether lending objects are unavailable', () => {
    const baseState = rootReducer(undefined, { type: '@@INIT' });
    const state = {
      ...baseState,
      lendableObjects: {
        ...baseState.lendableObjects,
        fetchFailed: true,
      },
    };

    expect(selectLendableObjectsUnavailable(state)).toBe(true);
  });

  it('applies availability success only for matching request id', () => {
    const initial = lendableObjects(undefined, { type: '@@INIT' } as any);

    const begin = {
      type: LendableObjects.FETCH_AVAILABLE.BEGIN,
      meta: { requestId: 'r1' },
    } as any;
    const stateAfterBegin = lendableObjects(initial, begin);
    expect(stateAfterBegin.lastAvailabilityRequestId).toBe('r1');

    const staleSuccess = {
      type: LendableObjects.FETCH_AVAILABLE.SUCCESS,
      payload: [1, 2],
      meta: { requestId: 'r0' },
    } as any;
    const stateAfterStale = lendableObjects(stateAfterBegin, staleSuccess);
    expect(stateAfterStale.availableIds).toBeNull();

    const matchSuccess = {
      type: LendableObjects.FETCH_AVAILABLE.SUCCESS,
      payload: [3],
      meta: { requestId: 'r1' },
    } as any;
    const stateAfterMatch = lendableObjects(stateAfterBegin, matchSuccess);
    expect(stateAfterMatch.availableIds).toEqual([3]);
  });

  it('clearAvailableIds action clears availability', () => {
    const afterSuccess = lendableObjects(undefined, {
      type: LendableObjects.FETCH_AVAILABLE.SUCCESS,
      payload: [9],
      meta: { requestId: 'r' },
    } as any);
    const afterClear = lendableObjects(afterSuccess, {
      type: 'lendableObjects/clearAvailableIds',
    } as any);
    expect(afterClear.availableIds).toBeNull();
  });
});
