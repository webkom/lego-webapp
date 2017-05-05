// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Flex.css';

type Props = {
  children: any,
  className: ?string,
  column: boolean,
  component: any,
  wrap: boolean,
  wrapReverse: boolean,
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around',
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
};

function Flex({
  children,
  className,
  column = false,
  component: Component = 'div',
  wrap = false,
  wrapReverse = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  flexWrap,
  padding,
  margin,
  width,
  style,
  ...htmlAttributes
}: Props) {
  return (
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
}

export default Flex;
