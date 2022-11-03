import styles from './AttendanceStatus.css';
import withModal from './withModal';
import type { EventPool } from 'app/models';
import Button from 'app/components/Button';
type AttendanceElementProps = {
  pool: EventPool;
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
    <strong>
      <p>{`${totalCount}/${capacity ? capacity : '∞'}`}</p>
    </strong>
  );

  return (
    <div className={styles.poolBox}>
      <strong>{name}</strong>
      {registrations ? (
        <Button flat onClick={() => toggleModal(index)}>
          <Status />
        </Button>
      ) : (
        <Status />
      )}
    </div>
  );
};

export type AttendanceStatusProps = {
  pools: Array<EventPool>;
  toggleModal: (arg0: number) => void;
  legacyRegistrationCount: number;
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

AttendanceStatus.Modal = withModal(AttendanceStatus);
export default AttendanceStatus;
