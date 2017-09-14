// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Icon.css';

type Props = {
  /** Name of the icon can be found on the webpage*/
  name: string,
  /** Name of the icon can be found on the webpage*/
  scaleOnHover?: boolean,
  /** Name of the icon can be found on the webpage*/
  className?: string,
  /** Name of the icon can be found on the webpage*/
  size?: number,
  /** Name of the icon can be found on the webpage*/
  style?: Object
};

/**
 * Render an Icon
 *
 * <Icon name="add" > </Icon>
 *
 * Just like this...
 *
 * http://ionicframework.com/docs/v2/ionicons/
 */
function Icon({
  name = 'star',
  scaleOnHover = false,
  className,
  size,
  ...props
}: Props) {
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
