// @flow
/* eslint no-console: 0 */

import 'babel-polyfill';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import cookie from 'js-cookie';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { isEmpty } from 'lodash';
import configureStore from 'app/utils/configureStore';
import renderApp from './render';
import { fetchMeta } from 'app/actions/MetaActions';
import {
  loginAutomaticallyIfPossible,
  maybeRefreshToken
} from 'app/actions/UserActions';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

if (isEmpty(preloadedState)) {
  store
    .dispatch(loginAutomaticallyIfPossible(cookie.get))
    .then(() => store.dispatch(fetchMeta()))
    .then(() => store.dispatch(maybeRefreshToken()));
} else {
  store.dispatch(maybeRefreshToken());
}

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch({ type: 'REHYDRATED' });

renderApp(store, history);

if (module.hot) {
  module.hot.accept('./render', () => {
    renderApp(store, history);
  });
}
