// @flow

import 'babel-polyfill';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'app/utils/configureStore';
import renderApp from './render';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch({ type: 'REHYDRATED' });

renderApp(store, history);

if (module.hot) {
  module.hot.accept('./render', () => {
    renderApp(store, history);
  });
}
