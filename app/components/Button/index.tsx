import { LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
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

function Button({
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
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
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
        className
      )}
      type={submit ? 'submit' : 'button'}
      {...rest}
    >
      <LoadingIndicator small margin={0} loading={pending} />
      {pending ? <span className={styles.loading}>Laster</span> : children}
    </button>
  );
}

export default Button;
