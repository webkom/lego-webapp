import cx from 'classnames';
import { ChevronDown } from 'lucide-react';
import moment from 'moment-timezone';
import Time from '~/components/Time';
import {
  activateOnKey,
  dayLabel,
  groupKeyOf,
  weekLabel,
} from '~/pages/events/interest/utils';
import styles from './EventAgenda.module.css';
import GroupCircle from './GroupCircle';
import type { ListEvent } from '~/redux/models/Event';

type Props = {
  hiddenEvents: ListEvent[];
  isPast: boolean;
  onShowMore: () => void;
};

const ShowMoreRow = ({ hiddenEvents, isPast, onShowMore }: Props) => {
  const nextHidden = hiddenEvents[0];

  if (!nextHidden) return null;

  const nextStart = moment(nextHidden.startTime);
  const nextKey = groupKeyOf(nextStart, isPast);
  const nextLabel = isPast ? weekLabel(nextStart) : dayLabel(nextStart);

  const peekEvents = hiddenEvents
    .filter((event) => groupKeyOf(moment(event.startTime), isPast) === nextKey)
    .slice(0, 2);

  return (
    <div
      className={cx(styles.dayRow, styles.showMoreRow)}
      role="button"
      tabIndex={0}
      title="Vis flere dager"
      onClick={onShowMore}
      onKeyDown={activateOnKey(onShowMore)}
    >
      <div className={styles.dayLabel}>
        <div className={cx(styles.dayName, styles.dayNameMuted)}>
          {nextLabel.label}
        </div>
        <div className={styles.dayDate}>{nextLabel.subLabel}</div>
      </div>
      <div className={styles.peek}>
        <div className={styles.peekRows} aria-hidden>
          {peekEvents.map((event) => (
            <div key={event.id} className={styles.peekRow}>
              <GroupCircle group={event.responsibleGroup} />
              <div className={styles.eventInfo}>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventMeta}>
                  <Time time={event.startTime} format="HH:mm" /> ·{' '}
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.peekOverlay}>
          <span className={styles.showMoreShift}>
            <span className={styles.showMoreButton}>
              Vis {hiddenEvents.length} til
              <ChevronDown size={13} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShowMoreRow;
