import React from 'react';
import cx from 'classnames';
import styles from './index.css';

interface Props {
  children?: any;
  className?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  style?: any;
  container?: boolean;
  flex?: any;
}

export const FlexRow = ({
  children,
  className,
  justifyContent,
  alignItems,
  flexWrap,
  style,
  ...rest
}: Props) => (
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
}: Props) => (
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
}: Props) => (
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
