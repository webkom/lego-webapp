import cx from 'classnames';
import { Link } from 'react-router-dom';
import Flex from '../Layout/Flex';
import styles from './Icon.module.css';
import type { ComponentProps, MouseEventHandler } from 'react';

type Props = {
  /** Name of the icon can be found on the webpage */
  name: string;
  className?: string;
  size?: number;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  danger?: boolean; // name: trash
  success?: boolean; // name: checkmark
  edit?: boolean; // name: pencil
  disabled?: boolean;
} & ComponentProps<typeof Flex>;

/**
 * Render an Icon like this with the name of your icon:
 *
 * <Icon name="add" />
 *
 * Names can be found here:
 * https://ionic.io/ionicons
 *
 */
export const Icon = ({
  name = 'star',
  className,
  style = {},
  size = 24,
  to,
  onClick,
  danger = false,
  success = false,
  edit = false,
  disabled = false,
  ...props
}: Props) => {
  return (
    <Flex
      className={cx(className)}
      style={{
        fontSize: `${size.toString()}px`,
        ...style,
      }}
      {...props}
    >
      {to ? (
        <Link to={to} className={styles.clickable}>
          <ion-icon name={name}></ion-icon>
        </Link>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={cx(
            styles.clickable,
            danger && styles.danger,
            success && styles.success,
            edit && styles.edit,
            disabled && styles.disabled
          )}
        >
          <ion-icon name={name}></ion-icon>
        </button>
      ) : (
        <>
          <ion-icon name={name}></ion-icon>
        </>
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
