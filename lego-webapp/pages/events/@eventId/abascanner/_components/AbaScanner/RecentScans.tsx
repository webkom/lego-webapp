import { Flex } from '@webkom/lego-bricks';
import Time from '~/components/Time';
import { useAppSelector } from '~/redux/hooks';
import { selectUserByUsername } from '~/redux/slices/users';
import styles from './RecentScans.module.css';
import { getScanStatus, type RecentScan } from './scanStatus';

const RecentScanRow = ({ username, status, scannedAt }: RecentScan) => {
  const user = useAppSelector((state) => selectUserByUsername(state, username));
  const { label, color } = getScanStatus(status);

  return (
    <Flex alignItems="center" gap="var(--spacing-sm)" className={styles.row}>
      <div className={styles.dot} style={{ backgroundColor: color }} />
      <span className={styles.name}>{user?.fullName ?? username}</span>
      <span className={styles.meta}>
        {label} • <Time time={scannedAt} format="HH:mm" />
      </span>
    </Flex>
  );
};

type Props = {
  scans: RecentScan[];
};

const RecentScans = ({ scans }: Props) => (
  <Flex column gap="var(--spacing-xs)">
    <span className={styles.heading}>Nylig skannet</span>
    {scans.length === 0 ? (
      <span className={styles.empty}>Ingen har blitt skannet enda...</span>
    ) : (
      scans.map((scan) => (
        <RecentScanRow key={`${scan.username}-${scan.scannedAt}`} {...scan} />
      ))
    )}
  </Flex>
);

export default RecentScans;
