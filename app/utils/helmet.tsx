/* eslint react/display-name: 0 */
import { Helmet } from 'react-helmet-async';
import config from 'app/config';
import type { ComponentType } from 'react';
import { createElement } from 'react';

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
type PropertyGenerator = (
  props: Record<string, any>,
  config?: Record<string, any>
) => Array<Property> | null | undefined;
export default function helmet<T>(
  propertyGenerator: PropertyGenerator | null | undefined
): any {
  return (Component: ComponentType<T>) =>
    ({
      PropertyGenerator,
      ...props
    }: T & {
      PropertyGenerator: PropertyGenerator | null | undefined;
    }): any => {
      const properties: Array<Property> | null | undefined =
        propertyGenerator && propertyGenerator(props, config);
      return (
        <>
          {properties && (
            <Helmet>
              {properties.map(({ element, children, ...props }, index) =>
                createElement(
                  element || 'meta',
                  {
                    key: index,
                    ...(props as Record<string, any>),
                  },
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
