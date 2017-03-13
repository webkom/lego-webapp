// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Button.css';

type Props = {
  children?: any,
  className?: string,
  size?: 'small' | 'normal' | 'large',
  submit?: boolean,
  dark?: boolean
};

/**
 * A basic <Button /> component
 *
 * # Example Usage
 * ```js
 * <LinkButton size='large' submit>Save</Button>
 * ```
 */
function LinkButton({
  children,
  className,
  size = 'normal',
  submit,
  dark = false,
  ...rest
}: Props) {
  return (
    <a
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
    </a>
  );
}

export default LinkButton;
