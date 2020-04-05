// @flow

import React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';
import type { History } from 'history';
import RouteConfig from './routes';
import ErrorBoundary from 'app/components/ErrorBoundary';

type Props = {
  store: Store,
  history: History
};

const Root = (props: Props) => {
  const { store, history, ...restProps } = props;
  return (
    <Provider store={store}>
      <ErrorBoundary openReportDialog>
        <ConnectedRouter history={history}>
          <RouteConfig {...restProps} />
        </ConnectedRouter>
      </ErrorBoundary>
    </Provider>
  );
};

export default hot(Root);
