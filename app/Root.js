// @flow

import React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';
import type { History } from 'history';
import RouteConfig from './routes';

type Props = {
  store: Store,
  history: History
};

const Root = (props: Props) => {
  const { store, history, ...restProps } = props;
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RouteConfig {...restProps} />
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
