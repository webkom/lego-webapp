import type { ComponentType } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { get } from 'lodash';
import type { Props } from 'app/components/LoadingIndicator';
/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */

export default function loadingIndicator(
  loadingProps: Array<string>,
  options: Props | null | undefined
): any {
  return (Component: ComponentType<any>) => {
    const Composed = (props: Record<string, any>) => (
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
