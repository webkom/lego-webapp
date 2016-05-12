import styles from './Octagon';
import React from 'react';

const Octagon = ({ size, children }) => {
  const style = { width: size, height: size };
  return (
    <div style={style} className={styles.octagonWrapper}>
      <div style={style} className={styles.octagon}>
        {children}
      </div>
    </div>
  );
};

export default Octagon;
