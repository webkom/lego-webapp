// @flow

import React from 'react';
import { setStatusCode } from 'app/actions/RoutingActions';
import { Router, applyRouterMiddleware } from 'react-router';
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
      <RouteHandler {...restProps} />
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
        render={applyRouterMiddleware(useScroll())}
      />
    </ErrorBoundary>
  )
);

export default Root;
