// @flow

import React from 'react';
import { setStatusCode } from 'app/actions/RoutingActions';
import { Router, applyRouterMiddleware } from 'react-router';
import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';
import { connect } from 'react-redux';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { useScroll } from 'react-router-scroll';

type Props = {
  store: Store
};

const Root = (props: Props) => {
  const { store, ...restProps } = props;
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RouteHandler {...restProps} />
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
    ...restProps
  }: {
    setStatusCode: (statusCode: ?number) => void
  }) => (
    <ErrorBoundary openReportDialog>
      <Router
        onError={err => setStatusCode(500)}
        {...restProps}
        render={applyRouterMiddleware(
          useScroll((prevRouterProps, { location, routes }) => {
            if (
              prevRouterProps &&
              location.pathname === prevRouterProps.location.pathname
            )
              return false;
            if (
              routes
                .concat(prevRouterProps ? prevRouterProps.routes : [])
                .some(route => route.ignoreScrollBehavior)
            ) {
              return false;
            }
            return true;
          })
        )}
      />
    </ErrorBoundary>
  )
);

export default hot(Root);
