import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { addNotification } from 'app/actions/NotificationActions';
import promiseMiddleware from './promiseMiddleware';
import createErrorMiddleware from './errorMiddleware';
import { WS } from './websockets';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const errorMiddleware = createErrorMiddleware((message) => addNotification({ message }));

export default function configureStore(initialState = {}) {
  const socket = new WS();
  const middlewares = [
    routerMiddleware(browserHistory),
    thunkMiddleware.withExtraArgument(socket),
    promiseMiddleware,
    errorMiddleware
  ];

  if (__DEV__) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(
    require('../reducers').default,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
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
