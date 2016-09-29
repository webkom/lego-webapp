// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Icon.css';

type Props = {
  name: string,
  scaleOnHover?: boolean,
  className?: string
};

/**
 * Render a Font-Awesome icon.
 */
function Icon({ name = 'star', scaleOnHover = false, className, ...props }: Props) {
  return (
    <i
      className={cx(
        'fa',
        `fa-${name}`,
        scaleOnHover && 'u-scale-on-hover',
        styles.icon,
        className
      )}
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
