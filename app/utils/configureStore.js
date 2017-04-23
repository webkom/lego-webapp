import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { addNotification } from 'app/actions/NotificationActions';
import promiseMiddleware from './promiseMiddleware';
import createErrorMiddleware from './errorMiddleware';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const errorMiddleware = createErrorMiddleware(message =>
  addNotification({ message }));

export default function configureStore(initialState = {}) {
  const middlewares = [
    routerMiddleware(browserHistory),
    thunkMiddleware,
    promiseMiddleware,
    errorMiddleware
  ];

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;
    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(
    require('../reducers').default,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      global.devToolsExtension ? global.devToolsExtension() : f => f
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
