import React from 'react';
import cx from 'classnames';
import styles from './Flex.css';

function Flex({
  children,
  className,
  column = false,
  component: Component = 'div',
  wrap = false,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  ...htmlAttributes
}) {
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
