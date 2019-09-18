// @flow
/* eslint no-console: 0 */

import 'babel-polyfill';
import 'animate.css/animate.css';
import 'minireset.css/minireset.css';
import 'app/styles/globals.css';
import 'app/styles/icomoon.css';
import 'app/assets/manifest.json';
import 'app/assets/favicon.png';
import 'app/assets/icon-48x48.png';
import 'app/assets/icon-96x96.png';
import 'app/assets/icon-192x192.png';
import 'app/assets/icon-256x256.png';
import 'app/assets/icon-384x384.png';
import 'app/assets/icon-512x512.png';
// $FlowFixMe
import 'app/assets/opensearch.xml';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import cookie from 'js-cookie';
import config from 'app/config';
import raven from 'raven-js';
import configureStore, { history } from 'app/utils/configureStore';
import renderApp from './render';
import { fetchMeta } from 'app/actions/MetaActions';
import {
  loginAutomaticallyIfPossible,
  maybeRefreshToken
} from 'app/actions/UserActions';

console.error(`
                     \`smMMms\`
                     NMMMMMMN
            \`.\`      NMMMMMMN      \`.\`
         .omMMMm+    NMMMMMMN    +mMMMmo.
       .yMMMMMMMM:   NMMMMMMN   :MMMMMMMMy.
      oMMMMMMMMMN.   NMMMMMMN   .NMMMMMMMMMo
    \`hMMMMMMMMm+\`    NMMMMMMN    \`+mMMMMMMMMh\`
   \`dMMMMMMMN+       /NMMMMN/       +NMMMMMMMd\`
   hMMMMMMMd.         \`/oo/\`         .dMMMMMMMh         ##       ########  ######    #######
  /MMMMMMMd\`                          \`dMMMMMMM/        ##       ##       ##    ##  ##     ##
  dMMMMMMM-                            -MMMMMMMd        ##       ##       ##        ##     ##
 \`MMMMMMMd                              dMMMMMMM\`       ##       ######   ##   #### ##     ##
 .MMMMMMMy                              yMMMMMMM.       ##       ##       ##    ##  ##     ##
 \`MMMMMMMm                              mMMMMMMM\`       ##       ##       ##    ##  ##     ##
  dMMMMMMM:                            :MMMMMMMd        ######## ########  ######    #######
  :MMMMMMMm\`                          \`mMMMMMMM:
   yMMMMMMMm.                        .mMMMMMMMy                LEGO Er Ganske Oppdelt
    dMMMMMMMMo\`                    \`oMMMMMMMMd            https://github.com/webkom/lego
     yMMMMMMMMNs-                -sNMMMMMMMMy
      /NMMMMMMMMMmy+-\`      \`-+ymMMMMMMMMMN/                   Laget med ☕ av webkom
       \`sNMMMMMMMMMMMMMNmmNMMMMMMMMMMMMMNs\`
         \`omMMMMMMMMMMMMMMMMMMMMMMMMMMmo\`
            -ohNMMMMMMMMMMMMMMMMMMNho-
                -/shdmNMMMMNmdhs/-

`);

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
const isSSR = window.__IS_SSR__;

const store = configureStore(preloadedState, {
  raven,
  getCookie: key => cookie.get(key)
});

if (isSSR) {
  store.dispatch(maybeRefreshToken());
} else {
  store
    .dispatch(loginAutomaticallyIfPossible())
    .then(() => store.dispatch(fetchMeta()))
    .then(() => store.dispatch(maybeRefreshToken()));
}

store.dispatch({ type: 'REHYDRATED' });

renderApp({ store, history, isSSR });

if (module.hot) {
  module.hot.accept('./render', () => {
    renderApp({ store, history, isSSR });
  });
}
