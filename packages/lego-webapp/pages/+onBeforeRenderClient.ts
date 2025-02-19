import cookie from 'js-cookie';
import { createBrowserRouter, matchRoutes } from 'react-router';
import { PageContextClient } from 'vike/types';
import { routerConfig } from '~/pages/react-router/routerConfig';
import createStore from '../redux/createStore';

export async function onBeforeRenderClient(pageContext: PageContextClient) {
  pageContext.store = createStore(pageContext.storeInitialState, {
    getCookie: (key) => cookie.get(key),
  });

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
