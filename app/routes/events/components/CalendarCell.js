import styles from './Calendar.css';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router';
import colorForEvent from '../colorForEvent';
import Circle from 'app/components/Circle';

const Event = ({ id, title, eventType }) => (
  <div key={id}>
    <Circle color={colorForEvent(eventType)} />
    {' '}
    <Link to={`/events/${id}`}>{title}</Link>
  </div>
);

/**
 * Represents a cell in the calendar
 */
const CalendarCell = ({ day, className, events = [] }) => (
  <div className={cx(styles.day, className)}>
    <strong className={styles.dayNumber}>{day.date()}</strong>
    {events.map(Event)}
  </div>
);

function mapStateToProps(state, ownProps) {
  return {
    events: state.events.items.filter((event) =>
      moment(event.startTime).isSame(ownProps.day, 'day')
    )
  };
}

export default connect(
  mapStateToProps
)(CalendarCell);
