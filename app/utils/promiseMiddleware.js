// @flow

import type {
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
    if (action.type) {
      return next(action);
    }

    // Flow does not understand that action has to be a promiseAction since it has no type
    // $FlowFixMe
    const { types, payload, promise } = action;
    const meta: any = action.meta;

    const [PENDING, SUCCESS, FAILURE] = extractTypes(types);

    next({
      type: PENDING,
      payload,
      meta
    });

    return new Promise((resolve, reject) => {
      // $FlowFixMe
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
        (error: boolean) =>
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
