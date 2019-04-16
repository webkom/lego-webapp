

import * as React from 'react';
import { Helmet } from 'react-helmet';
import config from 'app/config';
import { type ComponentType, createElement } from 'react';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */

type PropertyGenerator = (
  props: Object,
  config?: Object
) => Array<{
  property?: string,
  content?: string,
  element?: string,
  children?: string,
  rel?: string,
  href?: string
}>;

export default function helmet<T>(propertyGenerator: ?PropertyGenerator) {
  return (Component: ComponentType<T>) => ({
    PropertyGenerator,
    ...props
  }: T & {
    propertyGenerator: PropertyGenerator
  }) => [
    <Helmet key="helmet">
      {!!propertyGenerator &&
        propertyGenerator(props, config).map(
          ({ element, children, ...props }, index) =>
            createElement(element || 'meta', { key: index, ...props }, children)
        )}
    </Helmet>,
    <Component key="component" {...props} />
  ];
}
