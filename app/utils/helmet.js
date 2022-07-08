// @flow
/* eslint react/display-name: 0 */

import { type ComponentType, createElement } from 'react';
import { Helmet } from 'react-helmet-async';

import config from 'app/config';

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
  href?: string,
};
type PropertyGenerator = (props: Object, config?: Object) => ?Array<Property>;

export default function helmet<T>(propertyGenerator: ?PropertyGenerator): any {
  return (Component: ComponentType<T>) =>
    ({
      PropertyGenerator,
      ...props
    }: T & {
      PropertyGenerator: ?PropertyGenerator,
    }): any => {
      const properties: ?Array<Property> =
        propertyGenerator && propertyGenerator(props, config);

      return (
        <>
          {properties && (
            <Helmet>
              {properties.map(({ element, children, ...props }, index) =>
                createElement(
                  element || 'meta',
                  { key: index, ...(props: Object) },
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
