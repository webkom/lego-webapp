/* eslint no-console: 0 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
import 'app/assets/opensearch.xml';
import '@webkom/lego-bricks/dist/style.css';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import renderApp from './render';

!import.meta.env.DEV &&
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

if (module.hot) {
  module.hot.accept('./render', () => {
    renderApp({
      store,
      isSSR,
    });
  });
}
