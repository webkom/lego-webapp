import cx from 'classnames';
import { Button as AriaButton } from 'react-aria-components';
import { LoadingIndicator } from '../LoadingIndicator';
import styles from './Button.module.css';
import type { ComponentProps, ReactNode } from 'react';

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

  /** Is the button disabled */
  disabled?: boolean;

  /** className for styling */
  className?: string;

  /** 'small', 'normal' or 'large' */
  size?: 'small' | 'normal' | 'large';

  /** Is the button a submit button? */
  submit?: boolean;

  /** is the button action pending? */
  isPending?: boolean;

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
} & Omit<ComponentProps<typeof AriaButton>, 'isDisabled'>;

export const Button = ({
  children,
  className,
  size = 'normal',
  submit,
  isPending = false,
  secondary = false,
  dark = false,
  danger = false,
  success = false,
  flat = false,
  ghost = false,
  disabled,
  ...rest
}: Props) => (
  <AriaButton
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
    isDisabled={disabled}
    {...rest}
  >
    <LoadingIndicator small margin={0} loading={isPending} />
    {isPending ? <span>Laster ...</span> : children}
  </AriaButton>
);
