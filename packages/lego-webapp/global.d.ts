import { Router } from 'react-router';
import { Store } from './redux/createStore';
import { RootState } from './redux/rootReducer';
import type { createBrowserRouter } from 'react-router';
import type { Config } from '~/utils/config';

declare global {
  namespace Vike {
    interface PageContext {
      store: Store;
      storeInitialState: RootState;
      router: Router;
    }
  }
}

declare global {
  interface Window {
    __staticRouterHydrationData: Parameters<
      typeof createBrowserRouter
    >[1]['hydrationData'];
    __CONFIG__: Config;
  }
}
