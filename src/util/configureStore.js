import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import createHashHistory from 'history/lib/createHashHistory';
import { reduxReactRouter, routerStateReducer } from 'redux-react-router';
import routes from '../routes';
import * as reducers from '../reducers';
import promiseMiddleware from '../middlewares/promiseMiddleware';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const middlewares = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware,
  loggerMiddleware
);

const finalCreateStore = compose(
  middlewares,
  reduxReactRouter({
    routes,
    createHistory: createHashHistory
  })
)(createStore);

const reducer = combineReducers({
  router: routerStateReducer,
  ...reducers
});

export default function configureStore(initialState) {
  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
