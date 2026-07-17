import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect } from 'react';
import Time from '~/components/Time';
import useJoinEvent from '~/pages/events/interest/useJoinEvent';
import { activateOnKey, attendanceLabel } from '~/pages/events/interest/utils';
import { fetchEvent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent,
} from '~/redux/slices/events';
import styles from './EventAgenda.module.css';
import EventAttendance from './EventAttendance';
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
  const { joinable, joined, isFull, label, title, onPress } =
    useJoinEvent(event);

  const dispatch = useAppDispatch();

  // Pools only exist on the detail serializer, so fetch it the first time
  // the row opens; joins and leaves keep the stored detail fresh after that
  useEffect(() => {
    if (expanded && !('pools' in event)) {
      dispatch(fetchEvent(event.id));
    }
  }, [expanded, event, dispatch]);

  const registrations = useAppSelector((state) =>
    selectRegistrationsFromPools(state, event.id),
  );
  const waitingRegistrations = useAppSelector((state) =>
    selectWaitingRegistrationsForEvent(state, event.id),
  );

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
        {!isPast && joinable && (
          <span onClick={(e) => e.stopPropagation()}>
            {joined ? (
              <button
                type="button"
                title={title}
                className={cx(styles.joinAction, styles.joinedPill)}
                onClick={onPress}
              >
                {label}
              </button>
            ) : (
              <Button
                size="small"
                secondary={!isFull}
                className={styles.joinAction}
                onPress={onPress}
              >
                {label}
              </Button>
            )}
          </span>
        )}
      </div>
      <div className={styles.eventPanel}>
        <div>
          <div className={styles.eventPanelContent}>
            <div
              className={styles.eventAttendance}
              onClick={(e) => e.stopPropagation()}
            >
              <EventAttendance
                event={event}
                registrations={registrations}
                waitingRegistrations={waitingRegistrations}
                isPast={isPast}
              />
            </div>
            <p className={styles.eventDescription}>{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
