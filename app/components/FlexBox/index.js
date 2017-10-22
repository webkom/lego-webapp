/* eslint-disable */
/* DEPRECATED DO NOT USE */
import React from 'react';
import cx from 'classnames';
import styles from './index.css';

export const FlexRow = ({
  children,
  className,
  justifyContent,
  alignItems,
  flexWrap,
  style,
  ...rest
}) => (
  <div
    className={cx(styles.row, className)}
    style={{
      justifyContent,
      alignItems,
      flexWrap,
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
  flexWrap,
  style,
  ...rest
}) => (
  <div
    className={cx(styles.column, className)}
    style={{
      justifyContent,
      alignItems,
      flexWrap,
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
