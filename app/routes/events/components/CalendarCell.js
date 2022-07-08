// @flow

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';

import Circle from 'app/components/Circle';
import Pill from 'app/components/Pill';
import Popover from 'app/components/Popover';
import type { Event } from 'app/models';
import { colorForEvent } from '../utils';

import styles from './Calendar.css';

const renderEvent = ({
  id,
  title,
  description,
  eventType,
  registrationCount,
  startTime,
  totalCapacity,
}: Event) => (
  <Popover
    key={id}
    triggerComponent={
      <div
        className={cx(
          styles.cell,
          moment(startTime) < moment() && styles.previousEvent
        )}
      >
        <span>
          <Circle
            color={colorForEvent(eventType)}
            style={{ marginRight: '5px' }}
          />
        </span>
        <Link to={`/events/${id}`} title={title}>
          {title}
        </Link>
      </div>
    }
  >
    <div>
      <h3 className={styles.eventItemTitle}>
        {title}
        {totalCapacity > 0 && (
          <Pill style={{ marginLeft: 10 }}>
            {`${registrationCount} / ${totalCapacity}`}
          </Pill>
        )}
      </h3>

      {description}
    </div>
  </Popover>
);

type CalendarCellProps = {
  day: moment$Moment,
  className: string,
  prevOrNextMonth: boolean,
  events: Array<Event>,
};

/**
 * Represents a cell in the calendar
 */
const CalendarCell = ({
  day,
  className,
  prevOrNextMonth,
  events = [],
}: CalendarCellProps) => (
  <div
    className={cx(
      styles.day,
      prevOrNextMonth && styles.prevNextMonthDay,
      className
    )}
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
    events: selectEvents(state, ownProps),
  };
}

// $FlowFixMe
export default connect(mapStateToProps)(CalendarCell);
