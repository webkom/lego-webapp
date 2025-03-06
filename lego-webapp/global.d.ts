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
      // Might be added by a navigate() call
      navigationState?: unknown;
    }
  }

  // This type is incomplete, but contains the parts we use
  class SearchController {
    constructor(options: {
      campusid: number;
      rows: number;
      withpois: boolean;
      withbuilding: boolean;
      withtype: boolean;
      withcampus: boolean;
      resultsFormat: string;
    });
    search(query: string): Promise<{
      results: {
        features: {
          properties: {
            dispPoiNames: string[];
            dispBldNames: string[];
            poiId: number;
          };
        }[];
      };
    }>;
  }

  interface Window {
    __staticRouterHydrationData: Parameters<
      typeof createBrowserRouter
    >[1]['hydrationData'];
    __CONFIG__: AppConfig;
    Mazemap:
      | undefined
      | {
          Map: any;
          mapboxgl: any;
          Util: any;
          MazeMarker: any;
          Data: any;
          Highlighter: any;
          Popup: any;
          Search: {
            SearchController: typeof SearchController;
          };
        };
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

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: {
      keepScrollPosition?: boolean;
      overwriteLastHistoryEntry?: boolean;
      navigationState?: unknown;
    };
  }
}
