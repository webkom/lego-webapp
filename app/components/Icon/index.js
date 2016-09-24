// @flow

import React from 'react';
import cx from 'classnames';

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
      <span
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: '#C24538',
          borderRadius: 6,
          minWidth: '28px',
          fontSize: '16px',
          color: '#fff',
          padding: '0 5px'
        }}
      >{badgeCount}</span>
      {icon}
    </div>
  );
};

export default Icon;
