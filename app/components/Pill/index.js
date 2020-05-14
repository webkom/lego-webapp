// @flow

import React from 'react';
import styles from './Pill.css';

type Props = {
  /** background color of pill */
  color?: string,
  /** extra css styling */
  style?: any,
};

/**
 * Basic `Pill` component to wrap extra content inside
 */
function Pill({ color, style, ...props }: Props) {
  return (
    <span
      className={styles.pill}
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    />
  );
}

export default Pill;
