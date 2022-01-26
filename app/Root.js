// @flow

import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';
import RouteConfig from './routes';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

type Props = {
  store: Store,
  history: any,
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
