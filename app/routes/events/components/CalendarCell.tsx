import cx from 'classnames';
import moment from 'moment-timezone';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import Pill from 'app/components/Pill';
import Popover from 'app/components/Popover';
import TextWithIcon from 'app/components/TextWithIcon';
import Time, { FromToTime } from 'app/components/Time';
import { selectAllEvents } from 'app/reducers/events';
import { useAppSelector } from 'app/store/hooks';
import { colorForEventType, textColorForEventType } from '../utils';
import styles from './Calendar.module.css';
import type { Dateish } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';
import type { ListEvent } from 'app/store/models/Event';
import type { Moment } from 'moment-timezone';

const renderEvent = (event: ListEvent) => {
  const {
    slug,
    eventType,
    title,
    description,
    totalCapacity,
    registrationCount,
  } = event;

  const startTime = moment(event.startTime);
  const endTime = moment(event.endTime);

  const isPreviousEvent = moment(endTime) < moment();

  const pillColor = colorForEventType(eventType);
  const titleColor = textColorForEventType(eventType);
  return (
    <Popover
      triggerComponent={
        <Link to={`/events/${slug}`}>
          <div
            className={cx(
              styles.eventPill,
              isPreviousEvent && styles.previousEvent,
            )}
            style={{ backgroundColor: pillColor }}
          >
            <span className={styles.eventTitle} style={{ color: titleColor }}>
              {title}
            </span>
          </div>
        </Link>
      }
    >
      <h3 className={styles.popoverEventTitle}>
        <span className={styles.popoverEventTitleText}>{title}</span>
        {totalCapacity > 0 && (
          <Pill style={{ marginLeft: 10 }}>
            {`${registrationCount} / ${totalCapacity}`}
          </Pill>
        )}
      </h3>
      <p className={styles.popoverEventDescription}>{description}</p>
      <TextWithIcon
        iconName="time-outline"
        content={
          <strong>
            {moment.duration(endTime.diff(startTime)) <
            moment.duration(1, 'days') ? (
              <span>
                <time>{startTime.format('HH:mm')}</time> -{' '}
                <time>{endTime.format('HH:mm')}</time>
              </span>
            ) : (
              <FromToTime from={event.startTime} to={event.endTime} />
            )}
          </strong>
        }
        className={styles.textWithIcon}
      />
      <TextWithIcon
        iconName="location-outline"
        content={<strong>{event.location}</strong>}
        className={styles.textWithIcon}
      />
      {event.activationTime && (
        <TextWithIcon
          iconName="alarm-outline"
          content={
            <strong>
              Påmelding <Time time={event.activationTime} format="ll HH:mm" />
            </strong>
          }
          className={styles.textWithIcon}
        />
      )}
    </Popover>
  );
};

type Props = {
  day: Moment;
  prevOrNextMonth: boolean;
};

const CalendarCell = ({ day, prevOrNextMonth }: Props) => {
  const events = useAppSelector((state) => selectEvents(state, day));
  return (
    <div
      className={cx(styles.cell, prevOrNextMonth && styles.prevNextMonthDay)}
    >
      <strong
        className={cx(
          styles.dayNumber,
          day.isSame(moment(), 'day') && styles.currentDay,
        )}
      >
        {day.date()}
      </strong>
      {events.map(renderEvent)}
    </div>
  );
};

/**
 Select events that occur on a specific day. Events that last over multiple days will be selected for every day it
 takes place. However, some events, like parties, might last over midnight, and it looks kind of weird for that event
 to be selected for two different days. Therefore, we add the criteria that an event has to last for more 24 hours in
 order for it to get selected for multiple days.
**/
const selectEvents = createSelector(
  selectAllEvents<ListEvent>,
  (_: RootState, day: Dateish) => day,
  (events, day) =>
    events.filter(
      (event) =>
        moment(event.startTime).isSame(day, 'day') ||
        (moment(event.startTime).isSameOrBefore(day, 'day') &&
          moment(event.endTime).isSameOrAfter(day, 'day') &&
          moment.duration(moment(event.endTime).diff(moment(event.startTime))) >
            moment.duration(1, 'days')),
    ),
);

export default CalendarCell;
