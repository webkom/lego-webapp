import { Flex } from '@webkom/lego-bricks';
import { orderBy } from 'lodash-es';
import moment from 'moment-timezone';
import Time from '~/components/Time';
import { Presence } from '~/redux/models/Registration';
import styles from './RecentScans.module.css';
import { getScanStatus } from './scanStatus';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

export const getRecentlyPresent = <
  T extends Pick<SelectedAdminRegistration, 'presence' | 'presenceDate'>,
>(
  registrations: T[],
) =>
  orderBy(
    registrations.filter(
      (registration) =>
        registration.presence === Presence.PRESENT && registration.presenceDate,
    ),
    (registration) => moment(registration.presenceDate).valueOf(),
    'desc',
  ).slice(0, 4);

type Props = {
  registrations: SelectedAdminRegistration[];
};

const RecentScans = ({ registrations }: Props) => {
  const recentlyPresent = getRecentlyPresent(registrations);
  const { label, color } = getScanStatus('success');

  return (
    <Flex column gap="var(--spacing-xs)">
      <span className={styles.heading}>Nylig skannet</span>
      {recentlyPresent.length === 0 ? (
        <span className={styles.empty}>Ingen har blitt skannet enda...</span>
      ) : (
        recentlyPresent.map((registration) => (
          <Flex
            key={registration.id}
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.row}
          >
            <div className={styles.dot} style={{ backgroundColor: color }} />
            <span className={styles.name}>{registration.user.fullName}</span>
            <span className={styles.meta}>
              {label} •{' '}
              <Time
                time={registration.presenceDate ?? undefined}
                format="HH:mm"
              />
            </span>
          </Flex>
        ))
      )}
    </Flex>
  );
};

export default RecentScans;
