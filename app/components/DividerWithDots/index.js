import React from 'react';
import styles from './DividerWithDots.css';
import cx from 'classnames';

const DividerWithDots = ({ extraStyle }) => {
  return (
    <div className={styles.vision__line} style={extraStyle}>
      <span className={styles.dot} />
      <span className={cx(styles.dot, styles.dotBottom)} />
    </div>
  );
};

export default DividerWithDots;
