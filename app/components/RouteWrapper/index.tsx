import { Route } from 'react-router-dom';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from 'react-router-dom';

/*
 * Wrapper component for react-router v4 to allow props
 * to be passed down to a route component by a parent component.
 */
type Props<PassedProps> = {
  passedProps: PassedProps;
  exact?: boolean;
  path: string | string[];
  Component: ComponentType<PassedProps & RouteComponentProps>;
  strict?: boolean;
};

const RouteWrapper = <PassedProps,>(props: Props<PassedProps>) => {
  const { passedProps, exact, path, Component, strict } = props;
  return (
    <Route
      exact={exact}
      path={path}
      strict={strict}
      render={(props) => <Component {...passedProps} {...props} />}
    />
  );
};

export default RouteWrapper;
