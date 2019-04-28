

import {
  Middleware,
  AsyncActionType,
  AsyncActionTypeArray
} from 'app/types';

function extractTypes(
  types: AsyncActionType | AsyncActionTypeArray
): AsyncActionTypeArray {
  if (Array.isArray(types)) {
    return types;
  }

  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export default function promiseMiddleware(): Middleware {
  return store => next => action => {
    if (!action.promise) {
      return next(action);
    }

    const { types, meta, payload, promise } = action;

    const [PENDING, SUCCESS, FAILURE] = extractTypes(types);

    next({
      type: PENDING,
      payload,
      meta
    });

    return new Promise((resolve, reject) => {
      promise.then(
        payload =>
          resolve(
            next({
              type: SUCCESS,
              payload,
              success: true,
              meta
            })
          ),
        error =>
          reject(
            next({
              type: FAILURE,
              payload: error,
              error: true,
              meta
            })
          )
      );
    });
  };
}
