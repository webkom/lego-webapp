import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import promiseMiddleware from './promiseMiddleware';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore(initialState = {}) {
  const mergeReducers = (reducers) => combineReducers({
    ...reducers,
    routing: routerReducer
  });

  const store = createStore(
    mergeReducers(require('../reducers')),
    initialState,
    applyMiddleware(
      routerMiddleware(hashHistory),
      thunkMiddleware,
      promiseMiddleware,
      loggerMiddleware
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = mergeReducers(require('../reducers'));
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
