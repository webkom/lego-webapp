import { Helmet } from 'react-helmet-async';
import config, { type Config } from 'app/config';
import type { MetaHTMLAttributes, ReactNode } from 'react';

type MetaProperty = MetaHTMLAttributes<HTMLMetaElement>;

export type PropertyGenerator<T> = (
  props: T,
  config?: Partial<Config>
) => MetaProperty[] | undefined;

/**
 * Component to manage Helmet properties for SEO and meta tags.
 *
 * @param propertyGenerator - A function that takes in props and config to generate an array of properties for Helmet.
 * @param props - The props that will be passed to the propertyGenerator function to generate Helmet properties.
 *
 * @example

 * const propertyGenerator: PropertyGenerator<{item: T}> = (props, config) => {
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
 *   return (
 *     <div>
 *       <PropertyHelmet propertyGenerator={propertyGenerator} item={item} />
 *       ...
 *     </div>
 *   );
 * };
 */
type Props<T> = {
  propertyGenerator: PropertyGenerator<T>;
  options: T;
  children?: ReactNode;
};
const PropertyHelmet = <T = unknown,>({
  propertyGenerator,
  options,
  children,
}: Props<T>) => {
  const properties = propertyGenerator(options, config);
  if (!properties) return null;
  return (
    <Helmet>
      {children}
      {properties.map((prop, index) => (
        <meta key={index} {...prop} />
      ))}
    </Helmet>
  );
};
export default PropertyHelmet;
