// @flow

import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Props } from 'app/components/LoadingIndicator';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
export default function loadingIndicator(loadingProp: string, options: ?Props) {
  return (Component: Class<React$Component<*, *, *>>) => {
    const Composed = (props: Object) => (
      <LoadingIndicator {...options} loading={!props[loadingProp]}>
        <Component {...props} />
      </LoadingIndicator>
    );

    const name = Component.displayName || Component.name || 'Component';
    Composed.displayName = `Loading${name}`;
    return Composed;
  };
}
