import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from './reducers';

function promiseMiddleware() {
  return next => action => {
    if (!action.promise) {
      return next(action);
    }

    const { type, meta, payload, promise } = action;

    next({
      type: `${type}_BEGIN`,
      payload,
      meta
    });

    return promise.then(
      payload => next({
        type: `${type}_SUCCESS`,
        payload,
        meta: { ...meta, receivedAt: Date.now() }
      }),
      error => next({
        type: `${type}_FAILURE`,
        payload: error,
        error: true
      })
    );
  };
}

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware,
  loggerMiddleware
)(createStore);

const reducer = combineReducers(reducers);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
