import cx from 'classnames';
import { Check } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useRef } from 'react';
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
import { fetchEvent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventStatusType } from '~/redux/models/Event';
import {
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent,
} from '~/redux/slices/events';
import EventAttendance from './EventAttendance';
import styles from './Spotlight.module.css';
import type { EntityId } from '@reduxjs/toolkit';
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

  const registrations = useAppSelector((state) =>
    selectRegistrationsFromPools(state, event.id),
  );
  const waitingRegistrations = useAppSelector((state) =>
    selectWaitingRegistrationsForEvent(state, event.id),
  );

  // The facepile lives in the detail payload, and the agenda's warm loop
  // skips the spotlighted event
  const dispatch = useAppDispatch();
  const requestedDetail = useRef<EntityId | null>(null);
  useEffect(() => {
    if ('pools' in event || requestedDetail.current === event.id) return;
    requestedDetail.current = event.id;
    dispatch(fetchEvent(event.id));
  }, [event, dispatch]);

  if (!group) return null;

  const start = moment(event.startTime);
  const prefix = badgePrefix(start);
  // The facepile carries the attendance - the label only adds value when
  // the event has no registration at all
  const attendance =
    event.eventStatusType === EventStatusType.OPEN
      ? attendanceLabel(event)
      : '';

  return (
    <div
      className={styles.spotlight}
      role="button"
      tabIndex={0}
      title="Se arrangementet"
      onClick={() => navigate(`/events/${event.slug}`)}
      onKeyDown={activateOnKey(() => navigate(`/events/${event.slug}`))}
    >
      <div className={cx(styles.background, groupGradient)} aria-hidden />
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
          {registrations.length > 0 && (
            <span
              className={styles.attendees}
              onClick={(e) => e.stopPropagation()}
            >
              <EventAttendance
                spotlight
                event={event}
                registrations={registrations}
                waitingRegistrations={waitingRegistrations}
                isPast={false}
              />
            </span>
          )}
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
