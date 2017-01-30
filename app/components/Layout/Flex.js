// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Flex.css';

type Props = {
  children: any,
  className: ?string,
  column: boolean,
  component: any,
  wrap: any,
  justifyContent: 'flex-start'|'flex-end'|'center'|'space-between'|'space-around',
  alignItems: 'flex-start'|'flex-end'|'center'|'baseline'|'stretch'
};

function Flex({
  children,
  className,
  column = false,
  component: Component = 'div',
  wrap = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  ...htmlAttributes
}: Props) {
  return (
    <Component
      className={cx(
        styles.flex,
        column ? styles.column : styles.row,
        wrap && styles.wrap,
        styles[`justifyContent__${justifyContent}`],
        styles[`alignItems__${alignItems}`],
        className
      )}
      {...htmlAttributes}
    >
      {children}
    </Component>
  );
}

export default Flex;
