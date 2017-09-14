import React from 'react';
import cx from 'classnames';
import styles from './Flex.css';

// Do this because prettier makes wierd formatting
const around = 'space-around';
const between = 'space-between';

type Props = {
  children: any,
  className?: string,
  /** Column or row */
  column?: boolean,
  /* Container component*/
  component?: any,
  /** Wrap elements */
  wrap?: boolean,
  /** Wrap elements in reverse order */
  wrapReverse?: boolean,
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | between | around,
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
};
/**
* Simple FlexBox component
*/
const Flex = ({
  children,
  className,
  column = false,
  component: Component = 'div',
  wrap = false,
  wrapReverse = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  padding,
  margin,
  width,
  style,
  ...htmlAttributes
}: Props) => (
  <Component
    className={cx(
      styles.flex,
      wrap && styles.wrap,
      wrapReverse && styles.wrapReverse,
      column ? styles.column : styles.row,
      styles[`justifyContent__${justifyContent}`],
      styles[`alignItems__${alignItems}`],
      className
    )}
    style={{
      padding,
      margin,
      width,
      ...style
    }}
    {...htmlAttributes}
  >
    {children}
  </Component>
);

export default Flex;
