// @flow

import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { get } from 'lodash';
import type { Props } from 'app/components/LoadingIndicator';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
export default function loadingIndicator(
  loadingProps: string | string[],
  options: ?Props
) {
  // $FlowFixMe React.Node in >= 0.53
  return (Component: React.Class<*, *, *>) => {
    const Composed = (props: Object) => {
      let loading = true;
      if (Array.isArray(loadingProps)) {
        loading =
          loadingProps.filter(loadingProp => !get(props, loadingProps)).length >
          0;
      } else {
        loading = !get(props, loadingProps);
      }

      return (
        <LoadingIndicator {...options} loading={loading}>
          <Component {...props} />
        </LoadingIndicator>
      );
    };

    const name = Component.displayName || Component.name || 'Component';
    Composed.displayName = `Loading${name}`;
    return Composed;
  };
}
