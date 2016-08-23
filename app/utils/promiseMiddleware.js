export default function promiseMiddleware() {
  return (next) => (action) => {
    if (!action.promise) {
      return next(action);
    }

    const { types, meta, payload, promise } = action;

    if (!Array.isArray(types) || types.length !== 3) {
      console.log(action);
      throw new TypeError(
        'promiseMiddleware expects action to contain a `types` property with 3 elements. ' +
        `${(types || []).join('')} was provided`
      );
    }

    const [PENDING, SUCCESS, FAILURE] = types;

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
