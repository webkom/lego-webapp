
type ActionTypeObject = {|BEGIN:string, SUCCESS:string, FAILURE:string|};
type ActionTypeArray = [string, string, string];

function extractTypes(types: ActionTypeArray|ActionTypeObject): ActionTypeArray {
  if (Array.isArray(types) && types.length === 3) {
    return types;
  }
  return [types.BEGIN, types.SUCCESS, types.FAILURE];
}

export default function promiseMiddleware() {
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
        ({ json, response, pagination }) => resolve(next({
          type: SUCCESS,
          payload: json,
          meta,
          pagination
        })),
        (error) => reject(next({
          type: FAILURE,
          error,
          meta
        }))
      );
    });
  };
}
