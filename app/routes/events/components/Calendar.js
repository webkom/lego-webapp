import styles from './Calendar.css';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import createCalendarDateObjects from '../createCalendarDateObjects';
import CalendarCell from './CalendarCell';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

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
    weekOffset: 0
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
          {WEEKDAYS.map((d) => <div key={d} className={styles.headingItem}>{d}</div>)}
          {createCalendarDateObjects(
            date,
            this.props.weekOffset,
            styles
          ).map((dateObject) =>
            <CalendarCell
              key={dateObject.day.format('x')}
              {...dateObject}
            />
          )}
        </div>
      </div>
    );
  }
}
