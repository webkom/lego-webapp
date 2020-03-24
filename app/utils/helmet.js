// @flow
/* eslint react/display-name: 0 */

import * as React from 'react';
import { Helmet } from 'react-helmet';
import config from 'app/config';
import { type ComponentType, createElement } from 'react';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
type Property = {
  property?: string,
  content?: string,
  element?: string,
  children?: string,
  rel?: string,
  href?: string
};
type PropertyGenerator = (props: Object, config?: Object) => ?Array<Property>;

export default function helmet<T>(propertyGenerator: ?PropertyGenerator) {
  return (Component: ComponentType<T>) => ({
    PropertyGenerator,
    ...props
  }: T & {
    propertyGenerator: ?PropertyGenerator
  }) => {
    const properties: ?Array<Property> =
      propertyGenerator && propertyGenerator(props, config);

    return (
      <>
        {properties && (
          <Helmet>
            {properties.map(({ element, children, ...props }, index) =>
              createElement(
                element || 'meta',
                { key: index, ...props },
                children
              )
            )}
          </Helmet>
        )}
        <Component {...props} />
      </>
    );
  };
}
