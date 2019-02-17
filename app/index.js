// @flow
/* eslint no-console: 0 */

import 'babel-polyfill';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import cookie from 'js-cookie';
import config from 'app/config';
import raven from 'raven-js';
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

// $FlowFixMe
require('../app/assets/opensearch.xml');
//require('../app/assets/manifest.json');
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

raven
  .config(config.ravenDSN, {
    release: config.release,
    environment: config.environment
  })
  .install();

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState, {
  raven,
  getCookie: key => cookie.get(key)
});

if (isEmpty(preloadedState)) {
  store
    .dispatch(loginAutomaticallyIfPossible())
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
