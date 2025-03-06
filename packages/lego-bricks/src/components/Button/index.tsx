import cx from 'classnames';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
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

type StyleProps = {
  /** className for styling */
  className?: string;

  /** 'small', 'normal' or 'large' */
  size?: 'small' | 'normal' | 'large';

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

const getButtonClassName = ({
  className,
  size = 'normal',
  secondary = false,
  dark = false,
  danger = false,
  success = false,
  flat = false,
  ghost = false,
}: StyleProps) =>
  cx(
    styles.button,
    styles[size],
    secondary && styles.secondary,
    dark && styles.dark,
    danger && styles.danger,
    success && styles.success,
    flat && styles.flat,
    ghost && styles.ghost,
    className,
  );

type ButtonProps = StyleProps &
  Omit<ComponentProps<typeof AriaButton>, 'isDisabled' | 'type'> & {
    /** content inside */
    children?: ReactNode;

    /** Is the button disabled? */
    disabled?: boolean;

    /** Is the button a submit button? */
    submit?: boolean;

    /** is the button action pending? */
    isPending?: boolean;
  };

export const Button = ({
  secondary,
  children,
  disabled,
  submit,
  isPending = false,
  ...rest
}: ButtonProps) => (
  <AriaButton
    type={submit ? 'submit' : 'button'}
    isDisabled={disabled}
    {...rest}
    className={getButtonClassName({
      secondary: submit || secondary,
      ...rest,
    })}
  >
    <LoadingIndicator small margin={0} loading={isPending} />
    {isPending ? <span>Laster ...</span> : children}
  </AriaButton>
);

type LinkButtonProps<S = unknown> = StyleProps &
  ComponentProps<typeof AriaLink> & {
    /** content inside */
    children?: ReactNode;

    /** is the button disabled? */
    disabled?: boolean;

    /** navigation state to navigate to */
    state?: S;
  };

export const LinkButton = <S = unknown>({
  children,
  disabled,
  state,
  ...rest
}: LinkButtonProps<S>) => {
  const className = getButtonClassName(rest);

  return (
    <AriaLink isDisabled={disabled} {...rest} className={className} routerOptions={{ navigationState: state }}>
      {children}
    </AriaLink>
  );
};
