import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Store } from 'app/store/store';
import RouteConfig from './routes';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import type { History } from 'history';

type Props = {
  store: Store;
  history: History;
};

const Root = (props: Props) => {
  const { store, history, ...restProps } = props;
  return (
    <HelmetProvider>
      <Provider store={store}>
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
