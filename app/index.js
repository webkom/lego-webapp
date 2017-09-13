// @flow
/* eslint no-console: 0 */

import 'babel-polyfill';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { isEmpty } from 'lodash';
import configureStore from 'app/utils/configureStore';
import renderApp from './render';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);

if (isEmpty(preloadedState)) {
  store.dispatch(loginAutomaticallyIfPossible());
}

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch({ type: 'REHYDRATED' });

renderApp(store, history);

if (module.hot) {
  module.hot.accept('./render', () => {
    renderApp(store, history);
  });
}
