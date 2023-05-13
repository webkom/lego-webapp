import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import ErrorBoundary from 'app/components/ErrorBoundary';
import type { Store } from 'app/store/createStore';
import { ThemeContextListener } from 'app/utils/themeUtils';
import RouteConfig from './routes';

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

export default hot(Root);
