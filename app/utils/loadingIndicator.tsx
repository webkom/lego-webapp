import { LoadingIndicator } from '@webkom/lego-bricks';
import { get } from 'lodash';
import type { LoadingIndicatorProps } from '@webkom/lego-bricks';
import type { ComponentType } from 'react';
/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */

export default function loadingIndicator<WrappedProps>(
  loadingProps: Array<string>,
  options?: LoadingIndicatorProps
) {
  return (Component: ComponentType<WrappedProps>) => {
    const Composed = (props: LoadingIndicatorProps & WrappedProps) => (
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
