// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Icon.css';

type Props = {
  name: string,
  scaleOnHover?: boolean,
  className?: string,
  size?: number,
  style?: Object
};

/**
 * Render a Font-Awesome icon.
 */
function Icon(
  {
    name = 'star',
    scaleOnHover = false,
    className,
    style,
    size = 36,
    ...props
  }: Props
) {
  return (
    <i
      className={cx(`ion-ios-${name}`, styles.icon, className)}
      style={{
        fontSize: `${size}px`,
        ...style
      }}
      {...props}
    />
  );
}

Icon.Badge = ({ badgeCount, ...props }) => {
  const icon = <Icon {...props} />;

  if (!badgeCount) {
    return icon;
  }

  return (
    <div style={{ position: 'relative' }}>
      <span className={styles.badge}>{badgeCount}</span>
      {icon}
    </div>
  );
};

export default Icon;
