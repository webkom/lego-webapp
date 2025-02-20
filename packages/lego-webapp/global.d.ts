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
    }
  }
}

declare global {
  interface Window {
    __staticRouterHydrationData: Parameters<
      typeof createBrowserRouter
    >[1]['hydrationData'];
  }
}
