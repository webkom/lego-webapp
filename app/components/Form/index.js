import styles from './index.css';
import React from 'react';
import cx from 'classnames';

export const Form = ({
  children,
  className,
  horizontal = false,
  style,
  ...rest
}) => (
  <form
    className={cx(styles.form, className)}
    style={{
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      ...style
    }}
    {...rest}
  >
    {children}
  </form>
);


export const TextField = ({ className, ...rest }) => (
  <textarea
    className={cx(styles.textField, className)}
    {...rest}
  />
);
