// @flow

import React from 'react';
import styles from './AttendanceStatus.css';
import withModal from './withModal';
import type { EventPool } from 'app/models';

type AttendanceElementProps = {
  pool: EventPool,
  index: number,
  toggleModal: number => void,
  useModal: boolean,
  isCount: boolean
};

const AttendanceElement = ({
  // $FlowFixMe
  pool: { name, registrations = 0, capacity = '∞' },
  index,
  toggleModal,
  useModal,
  isCount
}: AttendanceElementProps) => {
  const registrationCount =
    isCount || !registrations ? registrations : registrations.length;
  const Status = () => <strong>{`${registrationCount}/${capacity}`}</strong>;

  return (
    <div className={styles.poolBox}>
      <strong>{name}</strong>
      {useModal ? (
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
  /*
   * The elemnts will only be clickabel if 'toggleModal' is truthy
   */
  useModal?: boolean,
  toggleModal: number => void,
  isCount?: boolean
};

const AttendanceStatus = ({
  pools,
  toggleModal,
  useModal = true,
  isCount = false
}: AttendanceStatusProps) => {
  const toggleKey = key => (pools.length > 1 ? key + 1 : key);
  return (
    <div className={styles.attendanceBox}>
      {(pools || []).map((pool, index) => (
        <AttendanceElement
          key={index}
          pool={pool}
          isCount={isCount}
          index={index}
          useModal={useModal}
          toggleModal={key => toggleModal(toggleKey(key))}
        />
      ))}
    </div>
  );
};

AttendanceStatus.Modal = withModal(AttendanceStatus);

export default AttendanceStatus;
