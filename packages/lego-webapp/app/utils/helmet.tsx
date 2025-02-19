/* eslint react/display-name: 0 */
import { createElement } from 'react';
import { Helmet } from 'react-helmet-async';
import appConfig from '~/utils/appConfig';
import type { ComponentType } from 'react';

/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */
type Property = {
  property?: string;
  content?: string;
  element?: string;
  children?: string;
  rel?: string;
  href?: string;
};

type PropertyGenerator<T> = (
  props: T,
  config?: Record<string, string | number | boolean>,
) => Array<Property> | null | undefined;

export default function helmet<T>(
  propertyGenerator: PropertyGenerator<T> | null | undefined,
) {
  return (Component: ComponentType<T>) => (props: T) => {
    const properties: Array<Property> | null | undefined =
      propertyGenerator && propertyGenerator(props, appConfig);

    return (
      <>
        {properties && (
          <Helmet>
            {properties.map(({ element, children, ...props }, index) =>
              createElement(
                element || 'meta',
                {
                  key: index,
                  ...props,
                },
                children,
              ),
            )}
          </Helmet>
        )}
        <Component {...props} />
      </>
    );
  };
}
