import cx from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import Pill from 'app/components/Pill';
import Popover from 'app/components/Popover';
import TextWithIcon from 'app/components/TextWithIcon';
import { FromToTime } from 'app/components/Time';
import type { Event } from 'app/models';
import { colorForEvent, textColorForEvent } from '../utils';
import styles from './Calendar.css';
import type { Moment } from 'moment-timezone';

const renderEvent = (event: Event) => {
  const {
    id,
    eventType,
    title,
    description,
    totalCapacity,
    registrationCount,
  } = event;

  const startTime = moment(event.startTime);
  const endTime = moment(event.endTime);

  const isPreviousEvent = moment(endTime) < moment();

  const pillColor = colorForEvent(eventType);
  const titleColor = textColorForEvent(eventType);
  return (
    <Popover
      triggerComponent={
        <Link to={`/events/${id}`}>
          <div
            className={cx(
              styles.eventPill,
              isPreviousEvent && styles.previousEvent
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
    </Popover>
  );
};

type Props = {
  day: Moment;
  prevOrNextMonth: boolean;
  events: Array<Event>;
};

const CalendarCell = (props: Props) => {
  const { day, prevOrNextMonth, events } = props;
  return (
    <div
      className={cx(styles.cell, prevOrNextMonth && styles.prevNextMonthDay)}
    >
      <strong
        className={cx(
          styles.dayNumber,
          day.isSame(moment(), 'day') && styles.currentDay
        )}
      >
        {day.date()}
      </strong>
      {events.map(renderEvent)}
    </div>
  );
};

// Select events that occur on the a specific day. Events that last over multiple days will be selected for every day it takes place. However, some events, like parties, might last over midnight, and it looks kind of weird for that event to be selected for two different days. Therefore, we add the criteria that an event has to last for more 24 hours in order for it to get selected for multiple days.
const selectEvents = createSelector(
  (state) => state.events.items,
  (state) => state.events.byId,
  (state, props) => props.day,
  (eventIds, eventsById, day) =>
    eventIds
      .map((id) => eventsById[id])
      .filter(
        (event) =>
          moment(event.startTime).isSame(day, 'day') ||
          (moment(event.startTime).isSameOrBefore(day, 'day') &&
            moment(event.endTime).isSameOrAfter(day, 'day') &&
            moment.duration(
              moment(event.endTime).diff(moment(event.startTime))
            ) > moment.duration(1, 'days'))
      )
);

const mapStateToProps = (state, ownProps) => {
  return {
    events: selectEvents(state, ownProps),
  };
};

export default connect(mapStateToProps)(CalendarCell);
