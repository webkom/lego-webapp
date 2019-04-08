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

type Props = {
  store: Store,
  history: History
};

const Root = (props: Props) => {
  const { store, history, ...restProps } = props;
  console.log(restProps);
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RouteHandler {...restProps} />
      </ConnectedRouter>
    </Provider>
  );
};

const RouteWithSubRoutes = route => {
  console.log(route);
  return (
    <>
      <Route
        path={route.path}
        render={props =>
          props.component && (
            <route.component {...props} routes={route.childRoutes} />
          )
        }
      />
    </>
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
    console.log(restProps);
    return (
      <ErrorBoundary openReportDialog>
        <routes.component {...restProps}>
          {routes.childRoutes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </routes.component>
      </ErrorBoundary>
    );
  }
);

export default hot(Root);
