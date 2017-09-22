// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Button.css';

type Props = {
  /** content inside */
  children?: any,
  /** className for styling */
  className?: string,
  /** 'small', 'normal' or 'large' */
  size?: 'small' | 'normal' | 'large',
  /** Is the button a submit button? */
  submit?: boolean,
  /** Dark background (red button)*/
  dark?: boolean,
  /** Primary button styling */
  primary?: boolean,
  /** Danger button styling */
  danger?: boolean
};

/**
 * A basic Button component
 *
 * ### Example Usage
 * ```js
 * <Button size='large' submit>Save</Button>
 * ```
 */
function Button({ children, className, size = 'normal', submit, dark = false, ...rest }: Props) {
  return (
    <button
      className={cx(styles.button, styles[size], dark && styles.dark, className)}
      type={submit ? 'submit' : 'button'}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
