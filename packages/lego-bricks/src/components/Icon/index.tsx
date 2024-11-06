import cx from 'classnames';
import { cloneElement, forwardRef } from 'react';
import { Button, Link } from 'react-aria-components';
import Flex from '../Layout/Flex';
import styles from './Icon.module.css';
import type { PressEvent } from '@react-types/shared/src/events';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

type Props = {
  name?: string /** name from ionicons: https://ionic.io/ionicons */;
  iconNode?: ReactNode /** iconNode from lucide: https://lucide.dev/icons/ */;
  className?: string;
  size?: number;
  strokeWidth?: number;
  to?: string;
  onPress?: (e: PressEvent) => void;
  danger?: boolean; // name: trash
  success?: boolean; // name: checkmark
  edit?: boolean; // name: pencil
  disabled?: boolean;
} & Omit<ComponentProps<typeof Flex>, 'onClick'>;

export const Icon = forwardRef<HTMLButtonElement & HTMLAnchorElement, Props>(
  (
    {
      name = 'star',
      iconNode,
      className,
      style = {},
      size = 24,
      strokeWidth = 1.75,
      to,
      onPress,
      danger = false,
      success = false,
      edit = false,
      disabled = false,
      ...props
    }: Props,
    ref,
  ) => {
    const classNames = cx(
      styles.clickable,
      danger && styles.danger,
      success && styles.success,
      edit && styles.edit,
      disabled && styles.disabled,
    );

    const iconElement = iconNode ? (
      <>
        {cloneElement(iconNode as ReactElement, {
          size,
          strokeWidth,
        })}
      </>
    ) : (
      <ion-icon name={name}></ion-icon>
    );

    return (
      <Flex
        className={className}
        style={{
          fontSize: `${size.toString()}px`,
          ...style,
        }}
        {...props}
      >
        {to ? (
          <Link
            href={to}
            isDisabled={disabled}
            className={classNames}
            ref={ref}
          >
            {iconElement}
          </Link>
        ) : onPress ? (
          <Button
            onPress={onPress}
            isDisabled={disabled}
            className={classNames}
            ref={ref}
          >
            {iconElement}
          </Button>
        ) : (
          iconElement
        )}
      </Flex>
    );
  },
);
Icon.displayName = 'Icon';

export function BadgeIcon({
  badgeCount,
  ...props
}: Props & {
  badgeCount: number;
}) {
  const icon = <Icon {...props} />;

  if (!badgeCount) {
    return icon;
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <span className={styles.badge}>{badgeCount}</span>
      {icon}
    </div>
  );
}
