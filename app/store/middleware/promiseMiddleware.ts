import type { Action, Middleware } from '@reduxjs/toolkit';
import { RootState } from 'app/store/rootReducer';

interface AsyncActionType {
  BEGIN: string;
  SUCCESS: string;
  FAILURE: string;
}

type AsyncActionTypeArray = [string, string, string];

function extractTypes(
  types: AsyncActionType | AsyncActionTypeArray
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

export interface ApiPendingAction<T = any> extends Action<`${string}.PENDING`> {
  payload: T;
  meta: any;
}
export interface ApiSuccessAction<T = any> extends Action<`${string}.SUCCESS`> {
  payload: T;
  success: true;
  meta: any;
}

export interface ApiFailureAction<T = unknown>
  extends Action<`${string}.FAILURE`> {
  payload: T;
  error: true;
  meta: any;
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
    } as ApiPendingAction);
    return new Promise((resolve, reject) => {
      promise.then(
        (payload) =>
          resolve(
            next({
              type: SUCCESS,
              payload,
              success: true,
              meta,
            } as ApiSuccessAction)
          ),
        (error: boolean) =>
          reject(
            next({
              type: FAILURE,
              payload: error,
              error: true,
              meta,
            } as ApiFailureAction)
          )
      );
    });
  };
}
