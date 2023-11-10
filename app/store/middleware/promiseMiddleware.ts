import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AsyncActionType, AsyncActionTypeArray } from 'app/types';

function extractTypes(
  types: AsyncActionType | AsyncActionTypeArray,
): AsyncActionTypeArray {
  if (Array.isArray(types)) {
    return types;
  }

  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export interface PromiseAction<T> {
  types: AsyncActionType;
  promise: Promise<T>;
  meta?: any;
  payload?: any;
}

export default function promiseMiddleware(): Middleware<
  <T>(action: PromiseAction<T>) => Promise<T>,
  RootState
> {
  return () => (next) => (action) => {
    if (typeof action !== 'object' || !action.types) {
      return next(action);
    }

    const { types, payload, promise, meta } = action as PromiseAction<unknown>;
    const [PENDING, SUCCESS, FAILURE] = extractTypes(types);
    next({
      type: PENDING,
      payload,
      meta,
    });
    return new Promise((resolve, reject) => {
      promise.then(
        (payload) =>
          resolve(
            next({
              type: SUCCESS,
              payload,
              success: true,
              meta,
            }),
          ),
        (error: boolean) =>
          reject(
            next({
              type: FAILURE,
              payload: error,
              error: true,
              meta,
            }),
          ),
      );
    });
  };
}
