// @flow

import React from 'react';
import cx from 'classnames';

type Props = {
  name: string,
  scaleOnHover?: boolean,
  className: string
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

export default Icon;
