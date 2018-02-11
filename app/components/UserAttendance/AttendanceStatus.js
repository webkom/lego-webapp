// @flow

import React from 'react';
import styles from './AttendanceStatus.css';
import withModal from './withModal';
import type { EventPool } from 'app/models';

type AttendanceElementProps = {
  pool: EventPool,
  index: number,
  toggleModal: number => void
};

const AttendanceElement = ({
  pool: { name, registrations, registrationCount, capacity },
  index,
  toggleModal
}: AttendanceElementProps) => {
  const Status = () => (
    <strong>{`${registrationCount}/${capacity ? capacity : '∞'}`}</strong>
  );

  return (
    <div className={styles.poolBox}>
      <strong>{name}</strong>
      {registrations ? (
        <a onClick={() => toggleModal(index)}>
          <Status />
        </a>
      ) : (
        <Status />
      )}
    </div>
  );
};

export type AttendanceStatusProps = {
  pools: Array<EventPool>,
  toggleModal: number => void
};

const AttendanceStatus = ({ pools, toggleModal }: AttendanceStatusProps) => {
  const toggleKey = key => (pools.length > 1 ? key + 1 : key);
  return (
    <div className={styles.attendanceBox}>
      {(pools || []).map((pool, index) => (
        <AttendanceElement
          key={index}
          pool={pool}
          index={index}
          toggleModal={key => toggleModal(toggleKey(key))}
        />
      ))}
    </div>
  );
};

AttendanceStatus.Modal = withModal(AttendanceStatus);

export default AttendanceStatus;
