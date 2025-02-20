import * as Sentry from '@sentry/react';
import cookie from 'js-cookie';
import moment from 'moment-timezone';
import { createBrowserRouter, matchRoutes } from 'react-router';
import { PageContextClient } from 'vike/types';
import { routerConfig } from 'app/routes';
import { maybeRefreshToken } from '~/redux/actions/UserActions';
import createStore from '../redux/createStore';

export async function onBeforeRenderClient(pageContext: PageContextClient) {
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

  // --- React router support ---
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routerConfig, window.location)?.filter(
    (m) => m.route.lazy,
  );
  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy?.();
        Object.assign(m.route, {
          ...routeModule,
          lazy: undefined,
        });
      }),
    );
  }
  pageContext.router = createBrowserRouter(routerConfig, {
    hydrationData: window.__staticRouterHydrationData,
  });
}
