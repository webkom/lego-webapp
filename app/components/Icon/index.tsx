import cx from 'classnames';
import { Flex } from 'app/components/Layout';
import styles from './Icon.module.css';
import type { ComponentProps } from 'react';

type Props = {
  /** Name of the icon can be found on the webpage*/
  name: string;
  scaleOnHover?: boolean;
  className?: string;
  size?: number;
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
const Icon = ({
  name = 'star',
  className,
  style = {},
  size = 24,
  danger = false,
  success = false,
  edit = false,
  disabled = false,
  ...props
}: Props) => {
  return (
    <Flex
      className={cx(
        className,
        danger && styles.danger,
        success && styles.success,
        edit && styles.edit,
        disabled && styles.disabled
      )}
      style={{
        fontSize: `${size.toString()}px`,
        ...style,
      }}
      {...props}
    >
      {/* eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <ion-icon name={name}></ion-icon>
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

export default Icon;
