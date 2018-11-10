import React from 'react';
import styles from './Statistic.css';
import cx from 'classnames';

const Statistic = ({ statistic, label, topLabel }) => {
  return (
    <div className={styles.container}>
      {topLabel && <div className={styles.topLabel}>{topLabel}</div>}
      <div className={styles.statistic}>{statistic}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default Statistic;
