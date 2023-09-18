import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
import ErrorBoundary from 'app/components/ErrorBoundary';
import type { Store } from 'app/store/createStore';
import { ThemeContextListener } from 'app/utils/themeUtils';
import RouteConfig from './routes';
import type { History } from 'history';

type Props = {
  store: Store;
  connectedHistory: History & { listenObject: boolean };
};

const Root = (props: Props) => {
  const { store, connectedHistory, ...restProps } = props;
  return (
    <HelmetProvider>
      <Provider store={store}>
        <ThemeContextListener />
        <ErrorBoundary openReportDialog>
          <Router history={connectedHistory}>
            <CompatRouter>
              <RouteConfig {...restProps} />
            </CompatRouter>
          </Router>
        </ErrorBoundary>
      </Provider>
    </HelmetProvider>
  );
};

export default Root;
