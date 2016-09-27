export default function promiseMiddleware() {
  return (next) => (action) => {
    if (!action.promise) {
      return next(action);
    }

    const { types, meta, payload, promise } = action;

    let PENDING;
    let SUCCESS;
    let FAILURE;

    if (Array.isArray(types)) {
      if (types.length !== 3) {
        console.log(action);
        throw new TypeError(
          'promiseMiddleware expects action to contain a `types` property with 3 elements. ' +
          `${(types || []).join('')} was provided`
        );
      }

      [PENDING, SUCCESS, FAILURE] = types;
    } else if (types.BEGIN && types.SUCCESS && types.FAILURE) {
      PENDING = types.BEGIN;
      SUCCESS = types.SUCCESS;
      FAILURE = types.FAILURE;
    } else {
      console.log(action);
      throw new TypeError(
        `promiseMiddleware expects action to contain a 'types' property with \
        3 elements or an object with attributes PENDING, SUCCESS and FAILURE.\
        ${JSON.stringify(types)} was provided`
      );
    }

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
