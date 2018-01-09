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

require('../app/assets/manifest.json');
require('../app/assets/favicon.png');
require('../app/assets/icon-48x48.png');
require('../app/assets/icon-96x96.png');
require('../app/assets/icon-192x192.png');
require('../app/assets/icon-256x256.png');
require('../app/assets/icon-384x384.png');
require('../app/assets/icon-512x512.png');

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
