/*
 * This function will use the type passed to dispatch actions.
 * This allows the actionCreators to pass multiple actions to dispatch when an action status changes
 */

function dispatchThis(dispatch, type, actionData) {
  if (typeof(type) === 'string') {
    dispatch({
      type,
      ...actionData
    });
  } else if (type instanceof Array) {
    type.forEach(fn => {
      dispatchThis(dispatch, fn, actionData);
    });
  } else if (typeof(type) === 'function') {
    const res = type(actionData);
    if (res) {
      dispatch(res);
    }
  }
}

export default function promiseMiddleware() {
  return next => action => {
    if (!action.promise) {
      return next(action);
    }

    let { types } = action;
    const { type, meta, payload, promise } = action;
    if (!types && !type) {
      throw new Error('No type or types provided in action (promiseMiddleware)');
    }
    if (!types) {
      types = {
        success: `${type}_SUCCESS`,
        failure: `${type}_FAILURE`,
        begin: `${type}_BEGIN`
      };
    }
    if (!types.success || !types.failure || !types.begin) {
      throw new Error(
        'Types is missing either success, error or begin type. ' +
        '(Maybe you referenced to non-existent constants?)'
      );
    }

    dispatchThis(next, types.begin, {
      payload,
      meta
    });

    return promise.then(result => {
      dispatchThis(next, types.success, {
        payload: result,
        meta: { ...meta, receivedAt: Date.now() }
      });
    }, error => {
      dispatchThis(next, types.failure, {
        payload: error,
        error: true
      });
    });
  };
}
