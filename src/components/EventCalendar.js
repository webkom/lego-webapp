import '../styles/Calendar.css';
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';
import { range, takeWhile, last } from 'lodash';
import colorForEvent from '../utils/colorForEvent';
import { Circle } from './ui';

/**
 * Generate days of an entire month.
 * Might require *some* memory, should maybe
 * figure out and un-beautify it.
 */
function createDateObjects(date, weekOffset, events = []) {
  const startOfMonth = date.startOf('month');

  let diff = startOfMonth.weekday() - weekOffset;
  if (diff < 0) diff += 7;

  const prevMonthDays = range(0, diff).map(n => ({
    day: startOfMonth.clone().subtract(diff - n, 'days'),
    classNames: 'prevMonth'
  }));

  const currentMonthDays = range(1, date.daysInMonth() + 1).map(index => ({
    day: moment([date.year(), date.month(), index]),
    events: events.filter(e => moment(e.startTime).isSame(moment([date.year(), date.month(), index]), 'day'))
  }));

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
  const nextMonthDays = takeWhile(range(1, 7), n => (daysAdded + n) % 7 !== 0).map((n) => ({
    day: last(currentMonthDays).day.clone().add(n, 'days'),
    classNames: 'nextMonth'
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}

/**
 *
 */
const Event = ({ id, title, eventType }) => (
  <div key={id}>
    <Circle color={colorForEvent(eventType)} />
    {' '}
    <Link to={`/events/${id}`}>{title}</Link>
  </div>
);

/**
 *
 */
const Day = ({ day, classNames, events = [] }) => (
  <div className={cx('Calendar__day', `Calendar__day--${classNames}`)}>
    <strong className='Calendar__day__number'>{day.date()}</strong>
    {events.map(Event)}
  </div>
);

/**
 *
 */
export default class EventCalendar extends Component {

  static propTypes = {
    weekOffset: PropTypes.number,
    events: PropTypes.array,
    location: PropTypes.object
  };

  static defaultProps = {
    weekOffset: 0,
    events: []
  };

  queryForPrevMonth(date) {
    // moment objects are mutated
    const newDate = date.clone().subtract(1, 'months');
    return { year: newDate.year(), month: newDate.month() + 1 };
  }

  queryForNextMonth(date) {
    const newDate = date.clone().add(1, 'months');
    return { year: newDate.year(), month: newDate.month() + 1 };
  }

  render() {
    const { year = moment().year(), month = moment().month() + 1 } = this.props.location.query;
    const date = moment([ parseInt(year, 10), parseInt(month, 10) - 1 ]);

    return (
      <div className='Calendar u-container'>
        <h2 className='Calendar__header'>
          <Link to='/events' query={this.queryForPrevMonth(date)}>&laquo;</Link>
          <span>{date.format('MMMM YYYY')}</span>
          <Link to='/events' query={this.queryForNextMonth(date)}>&raquo;</Link>
        </h2>

        <div className='Calendar__grid'>
          {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map(
            d => <div className='Calendar__headingItem'>{d}</div>
          )}
          {createDateObjects(
            date,
            this.props.weekOffset,
            this.props.events || []
          ).map(Day)}
        </div>
      </div>
    );
  }
}
