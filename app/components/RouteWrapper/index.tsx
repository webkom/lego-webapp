import { Route } from 'react-router-dom';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from 'react-router-dom';

/*
 * Wrapper component for react-router v4 to allow props
 * to be passed down to a route component by a parent component.
 */
type Props<PassedProps, RouteProps extends RouteComponentProps> = {
  passedProps: PassedProps;
  exact?: boolean;
  path: string | string[];
  Component: ComponentType<PassedProps & RouteProps>;
  strict?: boolean;
};

const RouteWrapper = <PassedProps, RouteProps extends RouteComponentProps>(
  props: Props<PassedProps, RouteProps>,
) => {
  const { passedProps, exact, path, Component, strict } = props;
  return (
    <Route
      exact={exact}
      path={path}
      strict={strict}
      render={(props: RouteProps) => <Component {...passedProps} {...props} />}
    />
  );
};

export default RouteWrapper;
