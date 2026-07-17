import cx from 'classnames';
import moment from 'moment-timezone';
import Time from '~/components/Time';
import {
  attendanceLabel,
  groupGradient,
  groupMonogram,
  isToday,
  isTomorrow,
} from '~/pages/events/interest/utils';
import styles from './Spotlight.module.css';
import type { ListEvent } from '~/redux/models/Event';

const badgePrefix = (start: moment.Moment) => {
  if (isToday(start)) return start.hour() >= 16 ? 'I kveld' : 'I dag';
  if (isTomorrow(start)) return 'I morgen';
  return null;
};

type Props = {
  event: ListEvent;
};

const Spotlight = ({ event }: Props) => {
  const group = event.responsibleGroup;

  if (!group) return null;

  const start = moment(event.startTime);
  const prefix = badgePrefix(start);

  return (
    <a href={`/events/${event.slug}`} className={styles.spotlight}>
      <div
        className={cx(styles.background, groupGradient(group))}
        aria-hidden
      />
      <div className={styles.scrim} aria-hidden />
      <span className={cx(styles.badge, isToday(start) && styles.badgeToday)}>
        {prefix ? (
          <>
            {prefix} · <Time time={event.startTime} format="HH:mm" />
          </>
        ) : (
          <Time time={event.startTime} format="dddd D. MMM · HH:mm" />
        )}
      </span>
      <span className={styles.monogram} aria-hidden>
        {groupMonogram(group)}
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
