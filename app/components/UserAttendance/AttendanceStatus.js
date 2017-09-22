// @flow

import React from 'react';
import styles from './AttendanceStatus.css';
import withModal from './withModal';

export type Props = {
  pools: Array<Object>,
  toggleModal: number => void
};

const AttendanceElement = ({ pool, i, toggleModal }) => {
  const capacity = pool.capacity ? pool.capacity : '∞';
  return (
    <div key={i} className={styles.poolBox}>
      <strong>{pool.name}</strong>
      <a onClick={() => toggleModal(i)}>
        <strong>
          {pool.registrations ? `${pool.registrations.length}/${capacity}` : `0/${capacity}`}
        </strong>
      </a>
    </div>
  );
};

const AttendanceStatus = ({ pools, toggleModal }: Props) => {
  const toggleKey = key => (pools.length > 1 ? key + 1 : key);
  return (
    <div className={styles.attendanceBox}>
      {(pools || []).map((pool, i) => (
        <AttendanceElement
          key={i}
          pool={pool}
          i={i}
          toggleModal={key => toggleModal(toggleKey(key))}
        />
      ))}
    </div>
  );
};

AttendanceStatus.Modal = withModal(AttendanceStatus);

export default AttendanceStatus;
