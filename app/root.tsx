import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import { Provider } from 'react-redux';
import createStore from 'app/store/createStore';
import * as Sentry from '@sentry/react';
import cookie from 'js-cookie';
import { maybeRefreshToken } from 'app/actions/UserActions';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Open+Sans:wght@700&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
  },
];

export const clientLoader = async () => {
  const preloadedState = window.__PRELOADED_STATE__;
  const store = createStore(preloadedState, {
    Sentry,
    getCookie: (key) => cookie.get(key),
  });
  store.dispatch(maybeRefreshToken());
  store.dispatch({
    type: 'REHYDRATED',
  });
  return { store };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f2f2f1" />

        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="/opensearch.xml"
          title="Abakus Søk"
        />
        <link rel="icon" href="/icon-512x512.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" sizes="512x512" />
        <link rel="icon" href="/icon-384x384.png" sizes="384x384" />
        <link rel="apple-touch-icon" href="/icon-384x384.png" sizes="384x384" />
        <link rel="icon" href="/icon-256x256.png" sizes="256x256" />
        <link rel="apple-touch-icon" href="/icon-256x256.png" sizes="256x256" />
        <link rel="icon" href="/app/assets/icon-192x192.png" sizes="192x192" />
        <link
          rel="apple-touch-icon"
          href="/app/assets/icon-192x192.png"
          sizes="192x192"
        />
        <link rel="icon" href="/icon-96x96.png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/icon-96x96.png" sizes="96x96" />
        <link rel="icon" href="/icon-48x48.png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/icon-48x48.png" sizes="48x48" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Abakus" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {/*<ThemeContextListener />*/}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <Provider store={loaderData.store}>
      <Outlet />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
