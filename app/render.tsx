import { createRoot, hydrateRoot } from 'react-dom/client';
import { matchRoutes } from 'react-router-dom';
import routerConfig from 'app/routes';
import Root from './Root';
import type { Store } from 'app/store/createStore';

const renderApp = async ({
  store,
  isSSR,
}: {
  store: Store;
  isSSR: boolean | undefined;
}) => {
  const rootElement: HTMLElement = document.getElementById('root')!;

  const root = <Root store={store} />;

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

  if (isSSR) {
    hydrateRoot(rootElement, root);
  } else {
    createRoot(rootElement).render(root);
  }
};

export default renderApp;
