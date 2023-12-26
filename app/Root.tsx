import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { ThemeContextListener } from 'app/utils/themeUtils';
import RouteConfig from './routes';
import type { Store } from 'app/store/createStore';

type Props = {
  store: Store;
};

const Root = ({ store }: Props) => (
  <HelmetProvider>
    <Provider store={store}>
      <ThemeContextListener />
      <ErrorBoundary openReportDialog>
        <BrowserRouter>
          <RouteConfig />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </HelmetProvider>
);

export default Root;
