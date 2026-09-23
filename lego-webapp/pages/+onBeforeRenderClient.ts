import * as Sentry from '@sentry/react';
import cookie from 'js-cookie';
import moment from 'moment-timezone';
import { PageContextClient } from 'vike/types';
import { maybeRefreshToken } from '~/redux/actions/UserActions';
import { setTheme } from '~/redux/slices/theme';
import createStore, { Store } from '../redux/createStore';
import 'moment/dist/locale/nb';

// The store must be shared across every client-side pageContext. Vike renders
// with isHydration=false both for its error page and after an aborted
// hydration, so a store created only during hydration leaves those renders
// without one.
let store: Store | undefined;

export async function onBeforeRenderClient(pageContext: PageContextClient) {
  if (!store) {
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

    store = createStore(pageContext.storeInitialState, {
      Sentry,
      getCookie: (key) => cookie.get(key),
    });
    store.dispatch(
      setTheme(
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light',
      ),
    );
    store.dispatch(maybeRefreshToken());
    store.dispatch({ type: 'REHYDRATED' });
  }

  pageContext.store = store;
}
