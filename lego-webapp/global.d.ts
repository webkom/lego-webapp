import {
  Router,
  createBrowserRouter,
  type StaticHandlerContext,
} from 'react-router';
import { Store } from './redux/createStore';
import { RootState } from './redux/rootReducer';
import type { HelmetServerState } from 'react-helmet-async/lib/types';

declare global {
  namespace Vike {
    interface PageContext {
      // Passed from server to client (as defined in './pages/+config.ts')
      storeInitialState: RootState;
      // Created on server and client
      store: Store;
      router: Router;
      // Created on server
      routerContext?: StaticHandlerContext;
      helmetContext?: {
        helmet?: HelmetServerState;
      };
      domParser?: (value: string) => HTMLDocument;
      preparedStateCode?: string;
    }
  }

  interface Window {
    __staticRouterHydrationData: Parameters<
      typeof createBrowserRouter
    >[1]['hydrationData'];
    __CONFIG__: AppConfig;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      WS_URL: string;
      BASE_URL: string;
      WEB_URL: string;
      CAPTCHA_KEY: string;
      SKIP_CAPTCHA: string;
      STRIPE_KEY: string;
      SENTRY_DSN: string;
      RELEASE: string;
      ENVIRONMENT:
        | 'production'
        | 'staging'
        | 'local_staging'
        | 'ci'
        | undefined;
    }
  }
}
