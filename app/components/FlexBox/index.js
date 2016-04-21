import styles from './index.css';
import React from 'react';
import cx from 'classnames';

export const FlexRow = ({
  children,
  className,
  justifyContent,
  alignItems,
  style,
  ...rest
}) => (
  <div
    className={cx(styles.row, className)}
    style={{
      justifyContent,
      alignItems,
      ...style
    }}
    {...rest}
  >
    {children}
  </div>
);

export const FlexColumn = ({
  children,
  className,
  justifyContent,
  alignItems,
  style,
  ...rest
}) => (
  <div
    className={cx(styles.column, className)}
    style={{
      justifyContent,
      alignItems,
      ...style
    }}
    {...rest}
  >
    {children}
  </div>
);

export const FlexItem = ({
  children,
  className,
  flex,
  container = false, // Add display: flex;
  ...rest
}) => (
  <div
    className={className}
    style={{
      flex,
      display: container ? 'flex' : 'block'
    }}
    {...rest}
  >
    {children}
  </div>
);
