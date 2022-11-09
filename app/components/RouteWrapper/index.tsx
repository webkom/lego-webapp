import { Route } from 'react-router-dom';
import type { ComponentType } from 'react';

/*
 * Wrapper component for react-router v4 to allow props
 * to be passed down to a route component by a parent component.
 */
type Props = {
  passedProps: Record<string, any>;
  exact?: boolean;
  path: string | string[];
  Component: ComponentType<Record<string, any>>;
  strict?: boolean;
};

const RouteWrapper = (props: Props) => {
  const { passedProps, exact, path, Component, strict, ...rest } = props;
  return (
    <Route
      exact={exact}
      path={path}
      strict={strict}
      render={(props) => <Component {...passedProps} {...rest} {...props} />}
    />
  );
};

export default RouteWrapper;
