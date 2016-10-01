// @flow

import React from 'react';
import styles from './Pill.css';

type Props = {
  color?: string,
  style?: any
};

function Pill({ color, style, ...props }: Props) {
  return (
    <span
      className={styles.pill}
      style={{
        backgroundColor: color,
        ...style
      }}
      {...props}
    />
  );
}

export default Pill;
