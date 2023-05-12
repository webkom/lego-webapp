import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import Tooltip from 'app/components/Tooltip';
import type { AttendanceModalProps } from 'app/components/UserAttendance/AttendanceModal';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import styles from './AttendanceStatus.css';
import type { Pool } from './AttendanceModalContent';

type AttendancePool = Pool & {
  capacity?: number;
  registrationCount?: number;
};

type AttendanceElementProps = {
  pool: AttendancePool;
  index: number;
  toggleModal: (tabIndex: number) => void;
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
  pools: AttendancePool[];
  toggleModal?: (index: number) => void;
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
          toggleModal={(key) => toggleModal?.(toggleKey(key))}
        />
      ))}
      {!!legacyRegistrationCount && (
        <div className={styles.poolBox}>
          <Tooltip content="Disse brukerne har blitt slettet etter de deltok på arrangementet">
            <strong>Anonyme</strong>
            <strong>
              <p>{`${legacyRegistrationCount}/∞`}</p>
            </strong>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const AttendanceStatusModal = ({
  pools,
  legacyRegistrationCount,
  title,
  isMeeting,
}: Omit<AttendanceStatusProps, 'toggleModal'> &
  Omit<AttendanceModalProps, 'children'>) => (
  <AttendanceModal pools={pools} title={title} isMeeting={isMeeting}>
    {({ toggleModal }) => (
      <AttendanceStatus
        pools={pools}
        toggleModal={toggleModal}
        legacyRegistrationCount={legacyRegistrationCount}
      />
    )}
  </AttendanceModal>
);

AttendanceStatus.Modal = AttendanceStatusModal;

export default AttendanceStatus;
