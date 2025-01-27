import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'animate.css/animate.css';
import 'minireset.css/minireset.css';
import 'app/styles/globals.css';
import 'app/styles/icomoon.css';
import '@webkom/lego-bricks/dist/style.css';
import * as Sentry from '@sentry/browser';
import cookie from 'js-cookie';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from 'app/Root';
import { fetchMeta } from 'app/actions/MetaActions';
import {
  loginAutomaticallyIfPossible,
  maybeRefreshToken,
} from 'app/actions/UserActions';
import config from 'app/config';
import createStore from 'app/store/createStore';

moment.locale('nb-NO');

global.log = function log(this: unknown, self = this) {
  console.log(self);
  return this;
};

Sentry.init({
  dsn: config.sentryDSN,
  release: config.release,
  environment: config.environment,
  normalizeDepth: 10,
});
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(preloadedState, {
  Sentry,
  getCookie: (key) => cookie.get(key),
});

const isSSR = window.__IS_SSR__;

if (isSSR) {
  store.dispatch(maybeRefreshToken());
} else {
  store
    .dispatch(loginAutomaticallyIfPossible())
    .then(() => store.dispatch(fetchMeta()))
    .then(() => store.dispatch(maybeRefreshToken()));
}

store.dispatch({
  type: 'REHYDRATED',
});

const rootElement: HTMLElement = document.getElementById('root')!;

ReactDOM.hydrateRoot(
  rootElement,
  <React.StrictMode>
    <Root store={store} />
  </React.StrictMode>,
);
