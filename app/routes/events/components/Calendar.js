// @flow

import styles from './Calendar.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { Link } from 'react-router';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import CalendarCell from './CalendarCell';
import Toolbar from './Toolbar';
import EventFooter from './EventFooter';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

type Props = {
  weekOffset: number,
  year: string,
  month: string,
  icalToken: string
};

function pathForPrevMonth(date: moment) {
  const newDate = date.clone().subtract(1, 'months');
  return `${newDate.year()}/${newDate.month() + 1}`;
}

function pathForNextMonth(date: moment) {
  const newDate = date.clone().add(1, 'months');
  return `${newDate.year()}/${newDate.month() + 1}`;
}

export default class Calendar extends Component {
  props: Props;

  static defaultProps = {
    weekOffset: 0
  };

  render() {
    const { year, month, actionGrant, icalToken } = this.props;
    const date = moment([parseInt(year, 10), parseInt(month, 10) - 1]);

    return (
      <div className={styles.root}>
        <Helmet title="Kalender" />
        <Toolbar actionGrant={actionGrant} />

        <h2 className={styles.header}>
          <Link to={`/events/calendar/${pathForPrevMonth(date)}`}>«</Link>
          <span>
            {date.format('MMMM YYYY')}
          </span>
          <Link to={`/events/calendar/${pathForNextMonth(date)}`}>»</Link>
        </h2>

        <div className={styles.grid}>
          {WEEKDAYS.map(d =>
            <div key={d} className={styles.headingItem}>
              {d}
            </div>
          )}
          {createMonthlyCalendar(
            date,
            this.props.weekOffset
          ).map((dateProps, i) => <CalendarCell key={i} {...dateProps} />)}
        </div>
        <EventFooter icalToken={icalToken} />
      </div>
    );
  }
}
