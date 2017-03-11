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
 * Render an Icon
 *
 * http://ionicframework.com/docs/v2/ionicons/
 */
function Icon(
  {
    name = 'star',
    scaleOnHover = false,
    className,
    size,
    ...props
  }: Props
) {
  return (
    <i className={cx(`ion-ios-${name}`, styles.icon, className)} {...props} />
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
