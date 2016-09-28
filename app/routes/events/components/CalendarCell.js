import styles from './Calendar.css';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import Circle from 'app/components/Circle';
import Popover from 'app/components/Popover';
import truncateString from 'app/utils/truncateString';
import colorForEvent from '../colorForEvent';

const Event = ({ id, title, description, eventType }) => (
  <Popover
    render={() => (
      <div key={id} style={{ whiteSpace: 'nowrap' }}>
        <Circle color={colorForEvent(eventType)} />
        {' '}
        <Link
          to={`/events/${id}`}
          title={title}
        >
          {truncateString(title, 10)}
        </Link>
      </div>
    )}
  >
    <div>
      <h2>{title}</h2>
      {description}
    </div>
  </Popover>
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

const selectEvents = createSelector(
  (state) => state.events.items,
  (state) => state.events.byId,
  (state, props) => props.day,
  (eventIds, eventsById, day) =>
    eventIds
      .map((id) => eventsById[id])
      .filter((event) => moment(event.startTime).isSame(day, 'day'))
);

function mapStateToProps(state, ownProps) {
  return {
    events: selectEvents(state, ownProps)
  };
}

export default connect(
  mapStateToProps
)(CalendarCell);
