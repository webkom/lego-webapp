import cx from 'classnames';
import LoadingIndicator from '../LoadingIndicator';
import styles from './Button.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

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

  /** Dark background (red button)*/
  dark?: boolean;

  /** Primary button styling */
  primary?: boolean;

  /** Danger button styling */
  danger?: boolean;

  /** Success button styling */
  success?: boolean;

  /** Make it look like a link */
  flat?: boolean;

  /** Ghost button styling */
  ghost?: boolean;
};

/**
 * A basic Button component
 *
 * ### Example Usage
 * ```js
 * <Button size='large' submit>Save</Button>
 * ```
 */
function Button({
  children,
  className,
  size = 'normal',
  submit,
  pending = false,
  dark = false,
  danger = false,
  success = false,
  flat = false,
  ghost = false,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={
        flat
          ? cx(styles.flat, className)
          : cx(
              styles.button,
              styles[size],
              dark && styles.dark,
              danger && styles.danger,
              success && styles.success,
              ghost && styles.ghost,
              className
            )
      }
      type={submit ? 'submit' : 'button'}
      {...rest}
    >
      <LoadingIndicator small margin={0} loading={pending} />
      {pending ? <span className={styles.loading}>Laster</span> : children}
    </button>
  );
}

export default Button;
