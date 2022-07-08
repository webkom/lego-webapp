// @flow

import type { ComponentType } from 'react';
import { get } from 'lodash';

import type { Props } from 'app/components/LoadingIndicator';
import LoadingIndicator from 'app/components/LoadingIndicator';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
export default function loadingIndicator(
  loadingProps: Array<string>,
  options: ?Props
): any {
  return (Component: ComponentType<*>) => {
    const Composed = (props: Object) => (
      <LoadingIndicator
        {...options}
        loading={
          loadingProps.filter((loadingProp) => !get(props, loadingProp))
            .length !== 0
        }
      >
        <Component {...props} />
      </LoadingIndicator>
    );

    const name = Component.displayName || Component.name || 'Component';
    Composed.displayName = `Loading${name}`;
    return Composed;
  };
}
