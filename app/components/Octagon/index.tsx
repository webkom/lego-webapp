import React from 'react';
import styles from './Octagon.css';

interface Props {
  size: number | string;
  children?: any;
}

function Octagon({ size, children }: Props) {
  const style = { width: size, height: size };
  return (
    <div style={style} className={styles.octagonWrapper}>
      <div style={style} className={styles.octagon}>
        {children}
      </div>
    </div>
  );
}

export default Octagon;
