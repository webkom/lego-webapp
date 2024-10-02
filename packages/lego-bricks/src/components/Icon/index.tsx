import cx from 'classnames';
import { cloneElement } from 'react';
import { Link } from 'react-aria-components';
import Flex from '../Layout/Flex';
import styles from './Icon.module.css';
import type {
  ComponentProps,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';

type Props = {
  name?: string /** name from ionicons: https://ionic.io/ionicons */;
  iconNode?: ReactNode /** iconNode from lucide: https://lucide.dev/icons/ */;
  className?: string;
  size?: number;
  strokeWidth?: number;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  danger?: boolean; // name: trash
  success?: boolean; // name: checkmark
  edit?: boolean; // name: pencil
  disabled?: boolean;
} & Omit<ComponentProps<typeof Flex>, 'onClick'>;

export const Icon = ({
  name = 'star',
  iconNode,
  className,
  style = {},
  size = 24,
  strokeWidth = 1.75,
  to,
  onClick,
  danger = false,
  success = false,
  edit = false,
  disabled = false,
  ...props
}: Props) => {
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
        absoluteStrokeWidth: true,
      })}
    </>
  ) : null;

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
        <Link href={to} className={classNames}>
          {iconElement ? iconElement : <ion-icon name={name}></ion-icon>}
        </Link>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={classNames}>
          {iconElement ? iconElement : <ion-icon name={name}></ion-icon>}
        </button>
      ) : iconElement ? (
        iconElement
      ) : (
        <ion-icon name={name}></ion-icon>
      )}
    </Flex>
  );
};

Icon.Badge = function IconBadge({
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
};
