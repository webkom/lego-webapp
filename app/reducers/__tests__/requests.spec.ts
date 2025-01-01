import moment from 'moment-timezone';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import requests, {
  executeRequest,
  requestFailed,
  requestStarted,
  RequestStatus,
  requestSucceeded,
  selectRequest,
} from 'app/reducers/requests';
import type { RequestState } from 'app/reducers/requests';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';

const pendingState: RequestState = {
  loading: true,
  status: RequestStatus.PENDING,
  ttl: 10000,
};

describe('reducers', () => {
  describe('requests', () => {
    it('should set default state on requestStarted', () => {
      const action = requestStarted({ id: 'test' });
      const state = {};
      const expected = {
        test: {
          loading: true,
          status: RequestStatus.PENDING,
          ttl: 10000,
        } satisfies RequestState,
      };
      expect(requests(state, action)).toEqual(expected);
    });
    it('should set ttl on requestStarted', () => {
      const action = requestStarted({ id: 'test', ttl: 69 });
      const state = {};
      expect(requests(state, action).test.ttl).toEqual(69);
    });
    it('should set state correctly on succeeded', () => {
      const state = { test: pendingState };
      const action = requestSucceeded({ id: 'test', result: 'result' });
      const expected = {
        test: {
          ...pendingState,
          loading: false,
          status: RequestStatus.SUCCESS,
          result: 'result',
          fetchTime: expect.any(Number),
        } satisfies RequestState<string>,
      };
      expect(requests(state, action)).toEqual(expected);
    });
    it('should set state correctly on failed', () => {
      const state = { test: pendingState };
      const action = requestFailed({ id: 'test', error: 'error' });
      const expected = {
        test: {
          ...pendingState,
          loading: false,
          status: RequestStatus.FAILURE,
          error: 'error',
        } satisfies RequestState<string>,
      };
      expect(requests(state, action)).toEqual(expected);
    });
  });
});

describe('requests', () => {
  describe('selectRequest', () => {
    it('should select request', () => {
      const state = {
        requests: {
          test: {
            loading: false,
            status: RequestStatus.SUCCESS,
            result: 'result',
          },
        },
      } as unknown as RootState;
      expect(selectRequest(state, 'test')).toEqual({
        loading: false,
        status: RequestStatus.SUCCESS,
        result: 'result',
      });
    });
    it('should return default state if request does not exist', () => {
      const state = { requests: {} } as RootState;
      expect(selectRequest(state, 'test')).toEqual({
        loading: false,
        status: RequestStatus.PENDING,
        ttl: 10000,
      });
    });
  });
  describe('executeRequest', () => {
    let dispatch: AppDispatch;
    beforeEach(() => {
      vi.useFakeTimers();
      dispatch = vi.fn();
    });

    const requestFunction = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'result';
    };

    it('should execute request', async () => {
      const state = { requests: {} } as RootState;
      const res = executeRequest('test', requestFunction, {
        dispatch,
        getState: () => state,
      });
      expect(dispatch).toHaveBeenCalledWith(requestStarted({ id: 'test' }));
      expect(dispatch).not.toHaveBeenCalledWith(
        requestSucceeded({ id: 'test', result: 'result' }),
      );
      vi.advanceTimersByTime(100);
      expect(await res).toEqual('result');
      expect(dispatch).toHaveBeenCalledWith(
        requestSucceeded({ id: 'test', result: 'result' }),
      );
    });
    it('should not execute request if cached', async () => {
      const state = {
        requests: {
          test: {
            loading: false,
            status: RequestStatus.SUCCESS,
            result: 'result',
            ttl: 1000,
            fetchTime: moment().valueOf() - 500,
          },
        },
      } as unknown as RootState;
      const res = executeRequest('test', requestFunction, {
        dispatch,
        getState: () => state,
      });
      expect(dispatch).not.toHaveBeenCalled();
      // result should be immediately available
      expect(await res).toEqual('result');
      expect(dispatch).not.toHaveBeenCalled();
    });
    it('should re-execute request if cache has expired', async () => {
      const state = {
        requests: {
          test: {
            loading: false,
            status: RequestStatus.SUCCESS,
            result: 'result',
            ttl: 1000,
            fetchTime: moment().valueOf() - 1500,
          },
        },
      } as unknown as RootState;
      const res = executeRequest('test', requestFunction, {
        dispatch,
        getState: () => state,
      });
      expect(dispatch).toHaveBeenCalledWith(requestStarted({ id: 'test' }));
      expect(dispatch).not.toHaveBeenCalledWith(
        requestSucceeded({ id: 'test', result: 'result' }),
      );
      vi.advanceTimersByTime(100);
      expect(await res).toEqual('result');
      expect(dispatch).toHaveBeenCalledWith(
        requestSucceeded({ id: 'test', result: 'result' }),
      );
    });
    it('should not execute request if already loading', async () => {
      const state = {
        requests: { test: { loading: true } },
      } as unknown as RootState;
      const res = executeRequest('test', requestFunction, {
        dispatch,
        getState: () => state,
      });
      expect(dispatch).not.toHaveBeenCalled();
      // Request should resolve from other execution
      state.requests.test = {
        loading: false,
        status: RequestStatus.SUCCESS,
        result: 'result',
        ttl: 10000,
        fetchTime: moment().valueOf(),
      };
      vi.advanceTimersByTime(100);
      expect(await res).toEqual('result');
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
