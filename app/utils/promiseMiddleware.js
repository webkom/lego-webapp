// @flow

export type ActionTypeObject = {|BEGIN: string, SUCCESS: string, FAILURE: string|};
export type ActionTypeArray = [string, string, string];

function extractTypes(types: ActionTypeArray | ActionTypeObject): ActionTypeArray {
  if (Array.isArray(types)) {
    return types;
  }

  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export default function promiseMiddleware(): any {
  return (next) => (action) => {
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
        (payload) => resolve(next({
          type: SUCCESS,
          payload,
          meta
        })),
        (error) => reject(next({
          type: FAILURE,
          payload: error,
          error: true,
          meta
        }))
      );
    });
  };
}
