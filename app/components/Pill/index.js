// @flow

import React from 'react';
import styles from './Pill.css';
import cx from 'classnames';

type Props = {
  /** background color of pill */
  color?: string,
  /** extra css styling */
  style?: any,
  className?: string
};

/**
* Basic `Pill` component to wrap extra content inside
*/
function Pill({ color, style, className, ...props }: Props) {
  return (
    <span
      className={cx(styles.pill, className)}
      style={{
        backgroundColor: color,
        ...style
      }}
      {...props}
    />
  );
}

export default Pill;
