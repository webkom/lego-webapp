import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import promiseMiddleware from './promiseMiddleware';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore(initialState = {}) {
  const store = createStore(
    require('../reducers').default,
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(hashHistory),
        thunkMiddleware,
        promiseMiddleware,
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
