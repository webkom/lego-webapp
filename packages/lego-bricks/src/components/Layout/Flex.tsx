import cx from 'classnames';
import styles from './Flex.module.css';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

type Props<C extends ElementType> = {
  children?: ReactNode | ReactNode[];
  className?: string;

  /** Column or row */
  column?: boolean;

  /* Container component*/
  component?: C;
  componentRef?: React.RefObject<HTMLElement>;

  /** Wrap elements */
  wrap?: boolean;

  /** Wrap elements in reverse order */
  wrapReverse?: boolean;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  padding?: number | string;
  margin?: number | string;
  width?: number | string;
  gap?: number | string;
  basis?: boolean;
} & ComponentPropsWithRef<C>;

/**
 * Simple FlexBox component
 */
const Flex = <C extends ElementType = 'div'>({
  children,
  className,
  column = false,
  component: Component = 'div' as C,
  componentRef,
  wrap = false,
  wrapReverse = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  padding,
  margin,
  width,
  gap,
  style,
  basis = true,
  ...htmlAttributes
}: Props<C>) => (
  <Component
    className={cx(
      styles.flex,
      wrap && styles.wrap,
      wrapReverse && styles.wrapReverse,
      column ? styles.column : styles.row,
      styles[`justifyContent__${justifyContent}`],
      styles[`alignItems__${alignItems}`],
      className,
      !basis && styles[`basis__small`],
    )}
    style={{
      padding,
      margin,
      width,
      gap,
      ...style,
    }}
    ref={componentRef}
    {...htmlAttributes}
  >
    {children}
  </Component>
);

export default Flex;
