// @flow

import React from 'react';
import { Helmet } from 'react-helmet';
import config from 'app/config';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
export default function helmet(
  properties: Object => Array<{ property: string, content: string }>
) {
  // $FlowFixMe React.Node in >= 0.53
  return (Component: React.Class<*, *, *>) => (props: Object) => [
    <Helmet key="helmet">
      {properties(props, config).map(tag => (
        <meta
          key={tag.property}
          property={tag.property}
          content={tag.content}
        />
      ))}
    </Helmet>,
    <Component key="component" {...props} />
  ];
}
