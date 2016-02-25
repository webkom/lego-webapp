import './Button.css';
import React from 'react';
import cx from 'classnames';

/**
 * A basic <Button /> component
 *
 * # Example Usage
 * ```js
 * <Button size='large' submit>Save this shit</Button>
 * ```
 */
export default ({
  children,
  className,
  size = 'normal',
  submit,
  dark = false,
  ...rest
}) => (
  <button
    className={cx(
      'Button',
      `Button--${size}`,
      dark && 'Button--dark',
      className
    )}
    type={submit ? 'submit' : 'button'}
    {...rest}
  >
    {children}
  </button>
);
