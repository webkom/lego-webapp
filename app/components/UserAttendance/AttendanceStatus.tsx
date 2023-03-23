import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import styles from './AttendanceStatus.css';
import withModal from './withModal';
import type { Pool } from './AttendanceModal';

type AttendancePool = Pool & {
  capacity: number;
  registrationCount?: number;
};

type AttendanceElementProps = {
  pool: AttendancePool;
  index: number;
  toggleModal: (arg0: number) => void;
};

const AttendanceElement = ({
  pool: { name, registrations, registrationCount, capacity },
  index,
  toggleModal,
}: AttendanceElementProps) => {
  const totalCount = registrations ? registrations.length : registrationCount;

  const Status = () => (
    <strong>{`${totalCount}/${capacity ? capacity : '∞'}`}</strong>
  );

  return (
    <Flex className={styles.poolBox}>
      <strong>{name}</strong>
      {registrations ? (
        <Button flat onClick={() => toggleModal(index)}>
          <Status />
        </Button>
      ) : (
        <Status />
      )}
    </Flex>
  );
};

export type AttendanceStatusProps = {
  pools: Array<AttendancePool>;
  toggleModal?: (arg0: number) => void;
  legacyRegistrationCount?: number;
};

const AttendanceStatus = ({
  pools,
  toggleModal,
  legacyRegistrationCount,
}: AttendanceStatusProps) => {
  const toggleKey = (key) => (pools.length > 1 ? key + 1 : key);

  return (
    <div className={styles.attendanceBox}>
      {(pools || []).map((pool, index) => (
        <AttendanceElement
          key={index}
          pool={pool}
          index={index}
          toggleModal={(key) => toggleModal(toggleKey(key))}
        />
      ))}
      {!!legacyRegistrationCount && (
        <div className={styles.poolBox}>
          <strong>Anonyme</strong>
          <strong>
            <p>{`${legacyRegistrationCount}/∞`}</p>
          </strong>
        </div>
      )}
    </div>
  );
};

AttendanceStatus.Modal = withModal<AttendanceStatusProps>(AttendanceStatus);
export default AttendanceStatus;
