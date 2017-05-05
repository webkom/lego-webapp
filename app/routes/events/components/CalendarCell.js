import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import Circle from 'app/components/Circle';
import Popover from 'app/components/Popover';
import colorForEvent from '../colorForEvent';
import styles from './Calendar.css';
import Pill from 'app/components/Pill';

const Event = ({
  id,
  title,
  description,
  eventType,
  registrationCount,
  totalCapacity
}) => (
  <Popover
    key={id}
    render={() => (
      <div className={styles.cell}>
        <Circle color={colorForEvent(eventType)} />
        {' '}
        <Link to={`/events/${id}`} title={title}>
          {title}
        </Link>
      </div>
    )}
  >
    <div>
      <h3 className={styles.eventItemTitle}>
        {title}
        <Pill style={{ marginLeft: 10 }}>
          {`${registrationCount} / ${totalCapacity}`}
        </Pill>
      </h3>

      {description}
    </div>
  </Popover>
);

/**
 * Represents a cell in the calendar
 */
const CalendarCell = ({ day, className, prevOrNextMonth, events = [] }) => (
  <div
    className={cx(
      styles.day,
      prevOrNextMonth && styles.prevNextMonthDay,
      className
    )}
  >
    <strong className={styles.dayNumber}>{day.date()}</strong>
    {events.map(Event)}
  </div>
);

const selectEvents = createSelector(
  state => state.events.items,
  state => state.events.byId,
  (state, props) => props.day,
  (eventIds, eventsById, day) =>
    eventIds
      .map(id => eventsById[id])
      .filter(event => moment(event.startTime).isSame(day, 'day'))
);

function mapStateToProps(state, ownProps) {
  return {
    events: selectEvents(state, ownProps)
  };
}

export default connect(mapStateToProps)(CalendarCell);
