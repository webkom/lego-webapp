import { Helmet } from 'react-helmet-async';
import config from 'app/config';
import type Config from 'config/Config';

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
  config?: Partial<Config>
) => Property[] | null | undefined;

/**
 * Hook to manage Helmet properties for SEO and meta tags.
 *
 * @param propertyGenerator - A function that takes in props and config to generate an array of properties for Helmet.
 * @param props - The props that will be passed to the propertyGenerator function to generate Helmet properties.
 * @returns - Nothing. The hook takes care of setting the Helmet properties as a side effect.
 *
 * @example
 
 * const propertyGenerator = (props, config) => {
 *   if (!props.item) return;
 *   return [
 *     {
 *       property: 'og:title',
 *       content: props.item.title,
 *     },
 *     {
 *       element: 'title',
 *       children: props.item.title,
 *     },
 *   ];
 * };
 * 
 * const YourComponent = ({ item }) => {
 *   const helmet = useHelmet(propertyGenerator, { item });
 * 
 *   return (
 *     <>
 *       {helmet}
 *       ...
 *     </>
 *   );
 * };
 *
 */
const useHelmet = <T extends Record<string, unknown>>(
  propertyGenerator: PropertyGenerator<T>,
  props: T
) => {
  const properties = propertyGenerator(props, config);

  if (!properties) return null;

  return (
    <Helmet>
      {properties.map((prop, index) => (
        <meta key={index} {...prop} />
      ))}
    </Helmet>
  );
};

export default useHelmet;
