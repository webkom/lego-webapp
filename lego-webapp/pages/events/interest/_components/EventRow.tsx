import { LinkButton } from '@webkom/lego-bricks';
import Time from '~/components/Time';
import { activateOnKey, attendanceLabel } from '~/pages/events/interest/utils';
import styles from './EventAgenda.module.css';
import GroupCircle from './GroupCircle';
import type { ListEvent } from '~/redux/models/Event';

type Props = {
  event: ListEvent;
  isPast: boolean;
  expanded: boolean;
  onToggle: () => void;
};

const EventRow = ({ event, isPast, expanded, onToggle }: Props) => {
  const group = event.responsibleGroup;

  return (
    <div
      className={styles.eventWrapper}
      data-expanded={expanded}
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={activateOnKey(onToggle)}
    >
      <div className={styles.eventRow}>
        <GroupCircle group={group} />
        <div className={styles.eventInfo}>
          <div className={styles.eventTitleLine}>
            <span className={styles.eventTitle}>{event.title}</span>
            {group && <span className={styles.eventGroup}>{group.name}</span>}
          </div>
          <div className={styles.eventMeta}>
            <Time
              time={event.startTime}
              format={isPast ? 'dddd HH:mm' : 'HH:mm'}
            />{' '}
            · {event.location} · {attendanceLabel(event)}
          </div>
        </div>
        {!isPast && (
          <span onClick={(e) => e.stopPropagation()}>
            <LinkButton
              size="small"
              secondary={!event.isAdmitted}
              ghost={event.isAdmitted}
              href={`/events/${event.slug}`}
            >
              {event.isAdmitted ? 'Med ✓' : 'Bli med'}
            </LinkButton>
          </span>
        )}
      </div>
      <div className={styles.eventPanel}>
        <div>
          <p className={styles.eventDescription}>{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
