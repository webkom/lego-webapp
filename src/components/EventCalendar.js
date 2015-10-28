import '../styles/Calendar.css';
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { range, takeWhile, last } from 'lodash';

/**
 * Generate days of an entire month.
 * Might require *some* memory, should maybe
 * figure out and un-beautify it.
 */
function getDaysForCalendar(date, weekOffset) {
  const startOfMonth = date.startOf('month');

  let diff = startOfMonth.weekday() - weekOffset;
  if (diff < 0) diff += 7;

  const prevMonthDays = range(0, diff).map(n => ({
    day: startOfMonth.clone().subtract(diff - n, 'days'),
    classNames: 'prevMonth'
  }));

  const currentMonthDays = range(1, date.daysInMonth() + 1).map(index => ({
    day: moment([date.year(), date.month(), index])
  }));

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
  const nextMonthDays = takeWhile(range(1, 7), n => (daysAdded + n) % 7 !== 0).map((n) => ({
    day: last(currentMonthDays).day.clone().add(n, 'days'),
    classNames: 'nextMonth'
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}

/* eslint-disable no-unused-vars */
const myEvents = {
  2015: {
    9: {
      1: [{ name: 'Foo' }, { name: 'Bar' }],
      2: [{ name: 'Balle' }]
    }
  }
};

function selectEvents(events, year, month, day) {
  return (events[year] && events[year][month] && events[year][month][day]) || [];
}

/**
 *
 */
const Event = ({ name }) => <div key={name}>{name}</div>;

/**
 *
 */
const Day = ({ day, classNames, events = [] }) => (
  <div className={cx('Calendar__day', `Calendar__day--${classNames}`)}>
    <strong>{day.format('YYYY-MM-D')}</strong>
    {events.map(Event)}
  </div>
);

/**
 *
 */
export default class EventCalendar extends Component {

  static propTypes = {
    weekOffset: PropTypes.number
  }

  static defaultProps = {
    weekOffset: 0
  }

  state = {
    date: moment()
  }

  handleNext() {
    this.setState({ date: this.state.date.add(1, 'months') });
  }

  handlePrev() {
    this.setState({ date: this.state.date.subtract(1, 'months') });
  }

  render() {
    return (
      <div className='Calendar u-container'>
        <h2 className='Calendar__header'>
          <span onClick={::this.handlePrev}>&laquo;</span>
          <span>{this.state.date.format('MMMM YYYY')}</span>
          <span onClick={::this.handleNext}>&raquo;</span>
        </h2>

        <div className='Calendar__grid'>
          {getDaysForCalendar(this.state.date, this.props.weekOffset).map((day, i) =>
            <Day
              {...day}
              key={i}
              events={selectEvents(myEvents, day.day.year(), day.day.month(), day.day.date())}
            />
          )}
        </div>
      </div>
    );
  }
}
