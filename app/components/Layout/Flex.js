// @flow

import cx from 'classnames';
import styles from './Flex.css';

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
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around',
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch',
  padding?: number | string,
  margin?: number | string,
  width?: number | string,
  style?: Object,
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
      ...style,
    }}
    {...(htmlAttributes: Object)}
  >
    {children}
  </Component>
);

export default Flex;
