import cx from 'classnames';
import { Check } from 'lucide-react';
import moment from 'moment-timezone';
import { navigate } from 'vike/client/router';
import Time from '~/components/Time';
import useJoinEvent from '~/pages/events/interest/useJoinEvent';
import {
  activateOnKey,
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
  const { joinable, joined, label, title, onPress } = useJoinEvent(event);

  if (!group) return null;

  const start = moment(event.startTime);
  const prefix = badgePrefix(start);
  const attendance = attendanceLabel(event);

  return (
    <div
      className={styles.spotlight}
      role="button"
      tabIndex={0}
      title="Se arrangementet"
      onClick={() => navigate(`/events/${event.slug}`)}
      onKeyDown={activateOnKey(() => navigate(`/events/${event.slug}`))}
    >
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
            {event.location}
            {attendance && <> · {attendance}</>}
          </span>
        </div>
        {joinable && (
          <button
            type="button"
            title={title}
            className={cx(styles.joinButton, joined && styles.joinButtonJoined)}
            onClick={(e) => {
              e.stopPropagation();
              onPress();
            }}
          >
            {label}
            {joined && <Check size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Spotlight;
