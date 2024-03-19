import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { ThemeContextListener } from 'app/utils/themeUtils';
import routerConfig from './routes';
import type { Store } from 'app/store/createStore';

type Props = {
  store: Store;
};

const router = createBrowserRouter(routerConfig);

const Root = ({ store }: Props) => (
  <HelmetProvider>
    <Provider store={store}>
      <ThemeContextListener />
      <ErrorBoundary openReportDialog>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  </HelmetProvider>
);

export default Root;
