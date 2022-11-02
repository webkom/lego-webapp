import type { Middleware, AsyncActionType, AsyncActionTypeArray, PromiseAction, AnyAction } from "app/types";

function extractTypes(types: AsyncActionType | AsyncActionTypeArray): AsyncActionTypeArray {
  if (Array.isArray(types)) {
    return types;
  }

  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export default function promiseMiddleware(): Middleware {
  return store => next => (action: AnyAction<any>) => {
    if (typeof action !== 'object' || !action.types) {
      return next(action);
    }

    const {
      types,
      payload,
      promise,
      meta
    } = (action as PromiseAction<any>);
    const [PENDING, SUCCESS, FAILURE] = extractTypes(types);
    next({
      type: PENDING,
      payload,
      meta
    });
    return new Promise((resolve, reject) => {
      promise.then(payload => resolve(next({
        type: SUCCESS,
        payload,
        success: true,
        meta
      })), (error: boolean) => reject(next({
        type: FAILURE,
        payload: error,
        error: true,
        meta
      })));
    });
  };
}