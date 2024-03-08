import cx from 'classnames';
import { LoadingIndicator } from '../LoadingIndicator';
import styles from './Button.module.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * A basic Button component
 *
 * ### Example Usage
 * ```js
 * <Button size='large' submit>Save</Button>
 * ```
 */

type Props = {
  /** content inside */
  children?: ReactNode;

  /** className for styling */
  className?: string;

  /** 'small', 'normal' or 'large' */
  size?: 'small' | 'normal' | 'large';

  /** Is the button a submit button? */
  submit?: boolean;

  /** is the button action pending? */
  pending?: boolean;

  /** Secondary button styling */
  secondary?: boolean;

  /** Dark background (red button)*/
  dark?: boolean;

  /** Danger button styling */
  danger?: boolean;

  /** Success button styling */
  success?: boolean;

  /** Make it look like a link */
  flat?: boolean;

  /** Ghost button styling */
  ghost?: boolean;
};

export const Button = ({
  children,
  className,
  size = 'normal',
  submit,
  pending = false,
  secondary = false,
  dark = false,
  danger = false,
  success = false,
  flat = false,
  ghost = false,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cx(
      styles.button,
      styles[size],
      (submit || secondary) && styles.secondary,
      dark && styles.dark,
      danger && styles.danger,
      success && styles.success,
      flat && styles.flat,
      ghost && styles.ghost,
      className,
    )}
    type={submit ? 'submit' : 'button'}
    {...rest}
  >
    <LoadingIndicator small margin={0} loading={pending} />
    {pending ? <span>Laster ...</span> : children}
  </button>
);
