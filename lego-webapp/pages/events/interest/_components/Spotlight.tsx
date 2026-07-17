import cx from 'classnames';
import moment from 'moment-timezone';
import { EventStatusType } from '~/redux/models/Event';
import styles from './Spotlight.module.css';
import type { ListEvent } from '~/redux/models/Event';

const GRADIENT_COUNT = 5;

const attendanceLabel = (event: ListEvent): string => {
  if (event.eventStatusType === EventStatusType.OPEN) {
    return 'ingen påmelding — bare møt opp';
  }

  const count = event.registrationCount ?? 0;

  if (event.totalCapacity) {
    return `${count} av ${event.totalCapacity} plasser tatt`;
  }

  return `${count} blir med`;
};

const badge = (event: ListEvent): { label: string; isToday: boolean } => {
  const start = moment(event.startTime);
  const time = start.format('HH:mm');

  if (start.isSame(moment(), 'day')) {
    return {
      label: `${start.hour() >= 16 ? 'I kveld' : 'I dag'} · ${time}`,
      isToday: true,
    };
  }

  if (start.isSame(moment().add(1, 'day'), 'day')) {
    return { label: `I morgen · ${time}`, isToday: false };
  }

  return { label: `${start.format('dddd D. MMM')} · ${time}`, isToday: false };
};

type Props = {
  event: ListEvent;
};

const Spotlight = ({ event }: Props) => {
  const group = event.responsibleGroup;

  if (!group) return null;

  const { label, isToday } = badge(event);
  const monogram = group.name.replace('Aba', '').slice(0, 2).toUpperCase();
  const gradient = (Number(group.id) || 0) % GRADIENT_COUNT;

  return (
    <a href={`/events/${event.slug}`} className={styles.spotlight}>
      <div
        className={cx(styles.background, styles[`gradient${gradient}`])}
        aria-hidden
      />
      <div className={styles.scrim} aria-hidden />
      <span className={cx(styles.badge, isToday && styles.badgeToday)}>
        {label}
      </span>
      <span className={styles.monogram} aria-hidden>
        {monogram}
      </span>
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.groupName}>{group.name}</span>
          <h2>{event.title}</h2>
          <span className={styles.meta}>
            {event.location} · {attendanceLabel(event)}
          </span>
        </div>
        <span className={styles.joinButton}>Bli med</span>
      </div>
    </a>
  );
};

export default Spotlight;
