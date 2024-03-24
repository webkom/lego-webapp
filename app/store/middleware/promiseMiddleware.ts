import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AsyncActionType, AsyncActionTypeArray, Action } from 'app/types';

function isPromiseAction(
  action: Action | PromiseAction<unknown>,
): action is PromiseAction<unknown> {
  return 'promise' in action;
}

function extractTypes(
  types: AsyncActionType | AsyncActionTypeArray,
): AsyncActionTypeArray {
  if (Array.isArray(types)) {
    return types;
  }

  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export interface PromiseAction<T, Meta = unknown> extends Omit<Action, 'type'> {
  types: AsyncActionType;
  promise: Promise<T>;
  meta: Meta;
}
export interface ResolvedPromiseAction<Payload = unknown, Meta = unknown> {
  type: AsyncActionType['SUCCESS'];
  payload: Payload;
  success: true;
  meta: Meta;
}
export interface RejectedPromiseAction<Payload = unknown, Meta = unknown> {
  type: AsyncActionType['FAILURE'];
  payload: Payload;
  error: true;
  meta: Meta;
}

export default function promiseMiddleware() {
  return () => (next) => (action) => {
    if (!isPromiseAction(action)) {
      return next(action);
    }

    const { types, payload, promise, meta } = action;
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
        (error: unknown) =>
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
