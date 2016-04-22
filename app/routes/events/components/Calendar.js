import styles from './Calendar.css';
import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';
import { range, takeWhile, last } from 'lodash';
import colorForEvent from '../colorForEvent';
import Circle from 'app/components/Circle';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

/**
 * Generate days of an entire month.
 *
 * @TODO: memoize
 */
function createDateObjects(date, weekOffset, events = []) {
  const startOfMonth = date.startOf('month');

  let diff = startOfMonth.weekday() - weekOffset;
  if (diff < 0) diff += 7;

  const prevMonthDays = range(0, diff).map((n) => ({
    day: startOfMonth.clone().subtract(diff - n, 'days'),
    className: styles.prevMonthDay
  }));

  const currentMonthDays = range(1, date.daysInMonth() + 1).map((index) => ({
    day: moment([date.year(), date.month(), index]),
    events: events.filter((e) =>
      moment(e.startTime).isSame(moment([date.year(), date.month(), index]), 'day')
    )
  }));

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
  const nextMonthDays = takeWhile(range(1, 7), (n) => (daysAdded + n) % 7 !== 0).map((n) => ({
    day: last(currentMonthDays).day.clone().add(n, 'days'),
    className: styles.nextMonthDay
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
const Day = ({ day, className, events = [] }) => (
  <div className={cx(styles.day, className)}>
    <strong className={styles.dayNumber}>{day.date()}</strong>
    {events.map(Event)}
  </div>
);


type Props = {
  weekOffset: number;
  events: Array<any>;
  location: any;
  year: string;
  month: string;
};

export default class Calendar extends Component {
  props: Props;

  static defaultProps = {
    weekOffset: 0,
    events: [],
    year: moment().year(),
    month: moment().month() + 1
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
    const { year, month } = this.props;
    const date = moment([parseInt(year, 10), parseInt(month, 10) - 1]);

    return (
      <div className={styles.root}>
        <h2 className={styles.header}>
          <Link to={{ pathname: '/events', query: this.queryForPrevMonth(date) }}>&laquo;</Link>
          <span>{date.format('MMMM YYYY')}</span>
          <Link to={{ pathname: '/events', query: this.queryForNextMonth(date) }}>&raquo;</Link>
        </h2>

        <div className={styles.grid}>
          {WEEKDAYS.map(
            (d) => <div key={d} className={styles.headingItem}>{d}</div>
          )}
          {createDateObjects(
            date,
            this.props.weekOffset,
            this.props.events || []
          ).map((dateObject) =>
            <Day key={dateObject.day.format('x')} {...dateObject} />
          )}
        </div>
      </div>
    );
  }
}
