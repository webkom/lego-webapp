import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { ThemeContextListener } from 'app/utils/themeUtils';
import RouteConfig from './routes';
import type { Store } from 'app/store/createStore';

type Props = {
  store: Store;
  history: any;
};

const Root = (props: Props) => {
  const { store, history, ...restProps } = props;
  return (
    <HelmetProvider>
      <Provider store={store}>
        <ThemeContextListener />
        <ErrorBoundary openReportDialog>
          <ConnectedRouter history={history}>
            <RouteConfig {...restProps} />
          </ConnectedRouter>
        </ErrorBoundary>
      </Provider>
    </HelmetProvider>
  );
};

export default Root;
