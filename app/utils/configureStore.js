import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import promiseMiddleware from './promiseMiddleware';
import createErrorMiddleware from './errorMiddleware';
import { addNotification } from 'app/actions/NotificationActions';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const errorMiddleware = createErrorMiddleware((message) => addNotification({ message }));

export default function configureStore(initialState = {}) {
  const store = createStore(
    require('../reducers').default,
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(hashHistory),
        thunkMiddleware,
        promiseMiddleware,
        errorMiddleware,
        loggerMiddleware
      ),
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
