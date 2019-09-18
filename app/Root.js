// @flow

import React from 'react';
import { setStatusCode } from 'app/actions/RoutingActions';
import { hot } from 'react-hot-loader/root';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';
import { connect } from 'react-redux';
import ErrorBoundary from 'app/components/ErrorBoundary';
import type { History } from 'history';
import AppRoute from './routes/app';
import RouteConfig from './routes';
import EventList from 'app/routes/events/EventListRoute';

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

const mapDispatchToProps = {
  setStatusCode
};
const RouteHandler = connect(
  null,
  mapDispatchToProps
)(
  ({
    setStatusCode,
    routes,
    ...restProps
  }: {
    setStatusCode: (statusCode: ?number) => void
  }) => {
    return <ErrorBoundary openReportDialog />;
  }
);

export default hot(Root);
