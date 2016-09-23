// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Button.css';

type Props = {
  children?: any,
  className?: string,
  size?: 'normal'|'large',
  submit?: boolean,
  dark?: boolean
};

/**
 * A basic <Button /> component
 *
 * # Example Usage
 * ```js
 * <Button size='large' submit>Save</Button>
 * ```
 */
function Button({
  children,
  className,
  size = 'normal',
  submit,
  dark = false,
  ...rest
}: Props) {
  return (
    <button
      className={cx(
        styles.button,
        styles[size],
        dark && styles.dark,
        className
      )}
      type={submit ? 'submit' : 'button'}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
