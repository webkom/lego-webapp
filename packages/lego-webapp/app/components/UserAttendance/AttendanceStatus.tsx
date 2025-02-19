import { Button, Flex, Skeleton } from '@webkom/lego-bricks';
import Tooltip from 'app/components/Tooltip';
import styles from './AttendanceStatus.module.css';
import type { AttendanceModalPool } from './AttendanceModalContent';

type AttendancePool = AttendanceModalPool & {
  capacity?: number;
  registrationCount?: number;
};

type AttendanceElementProps = {
  pool: AttendancePool;
  index: number;
  openModalTab: (tabIndex: number) => void;
};

const AttendanceElement = ({
  pool: { name, registrations, registrationCount, capacity },
  index,
  openModalTab,
}: AttendanceElementProps) => {
  const totalCount = registrations ? registrations.length : registrationCount;

  return (
    <Flex className={styles.poolBox}>
      <strong>{name}</strong>
      <Button
        flat
        disabled={!registrations}
        onPress={() => {
          if (registrations) {
            openModalTab(index);
          }
        }}
      >
        {`${totalCount}/${capacity ? capacity : '∞'}`}
      </Button>
    </Flex>
  );
};

export type AttendanceStatusProps = {
  pools: AttendancePool[];
  openModalTab: (index: number) => void;
  legacyRegistrationCount?: number;
  skeleton?: boolean;
};

const AttendanceStatus = ({
  pools,
  openModalTab,
  legacyRegistrationCount,
  skeleton,
}: AttendanceStatusProps) => {
  if (skeleton && !pools.length) {
    return <Skeleton className={styles.attendanceBox} />;
  }

  return (
    <div className={styles.attendanceBox}>
      {(pools || []).map((pool, index) => (
        <AttendanceElement
          key={index}
          pool={pool}
          index={index}
          openModalTab={openModalTab}
        />
      ))}
      {!!legacyRegistrationCount && (
        <div className={styles.poolBox}>
          <strong>Anonyme</strong>
          <Tooltip content="Disse brukerne har blitt slettet etter at de deltok på arrangementet">
            <Button flat disabled>{`${legacyRegistrationCount}`}</Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default AttendanceStatus;
