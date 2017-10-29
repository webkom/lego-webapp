// @flow

import React, { createElement } from 'react';
import { Helmet } from 'react-helmet';
import config from 'app/config';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
export default function helmet(
  properties: (
    props: Object,
    config?: Object
  ) => Array<{
    property?: string,
    content?: string,
    element?: string,
    children?: string,
    rel?: string,
    href?: string
  }>
) {
  // $FlowFixMe React.Node in >= 0.53
  return (Component: React.Class<*, *, *>) => (props: Object) => [
    <Helmet key="helmet">
      {properties(props, config).map(({ element, children, ...props }) =>
        createElement(element || 'meta', { ...props }, children)
      )}
    </Helmet>,
    <Component key="component" {...props} />
  ];
}
