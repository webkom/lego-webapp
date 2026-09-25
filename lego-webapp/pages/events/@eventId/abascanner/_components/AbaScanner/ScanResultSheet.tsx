import { Button, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ProfilePicture } from '~/components/Image';
import Time from '~/components/Time';
import { useAppSelector } from '~/redux/hooks';
import { selectUserByUsername } from '~/redux/slices/users';
import styles from './ScanResultSheet.module.css';
import { getScanStatus, type RecentScan } from './scanStatus';

type Props = {
  result: RecentScan | null;
  isOpen: boolean;
  resumeDelayMs: number;
  onDismiss: () => void;
};

const ScanResultSheet = ({
  result,
  isOpen,
  resumeDelayMs,
  onDismiss,
}: Props) => {
  const user = useAppSelector((state) =>
    result ? selectUserByUsername(state, result.username) : undefined,
  );
  const status = getScanStatus(result?.status ?? '');
  const StatusIcon = status.icon;

  return (
    <div
      role="status"
      aria-live="assertive"
      className={cx(styles.sheet, isOpen && styles.open)}
    >
      {result && (
        <>
          {status.isSuccess && (
            <div className={styles.countdownTrack}>
              <div
                key={`${result.username}-${result.scannedAt}`}
                className={styles.countdown}
                style={{
                  backgroundColor: status.color,
                  animationDuration: `${resumeDelayMs}ms`,
                }}
              />
            </div>
          )}
          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.header}
            style={{ backgroundColor: status.color }}
          >
            <StatusIcon size={24} />
            <h3 className={styles.title}>{status.title}</h3>
          </Flex>
          <Flex column gap="var(--spacing-md)" className={styles.body}>
            <Flex alignItems="center" gap="var(--spacing-md)">
              {user && <ProfilePicture user={user} size={56} />}
              <Flex column className={styles.person}>
                <span className={styles.name}>
                  {user?.fullName ?? result.username}
                </span>
                {user && (
                  <span className={styles.meta}>@{result.username}</span>
                )}
              </Flex>
            </Flex>
            <span className={styles.meta}>
              {status.description}{' '}
              <Time time={result.scannedAt} format="HH:mm" />
            </span>
            <Flex gap="var(--spacing-sm)">
              <Button
                secondary
                size="large"
                className={styles.button}
                onPress={onDismiss}
              >
                Skann videre
              </Button>
            </Flex>
          </Flex>
        </>
      )}
    </div>
  );
};

export default ScanResultSheet;
