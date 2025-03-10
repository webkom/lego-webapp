import * as Sentry from '@sentry/react';
import cookie from 'js-cookie';
import moment from 'moment-timezone';
import { PageContextClient } from 'vike/types';
import { maybeRefreshToken } from '~/redux/actions/UserActions';
import createStore from '../redux/createStore';
import 'moment/dist/locale/nb';

export async function onBeforeRenderClient(pageContext: PageContextClient) {
  if (pageContext.isHydration) {
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

    pageContext.store = createStore(pageContext.storeInitialState, {
      Sentry,
      getCookie: (key) => cookie.get(key),
    });
    pageContext.store.dispatch(maybeRefreshToken());
    pageContext.store.dispatch({ type: 'REHYDRATED' });
  }
}
