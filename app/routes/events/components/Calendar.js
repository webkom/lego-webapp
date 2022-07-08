// @flow

import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import type { ActionGrant, IcalToken } from 'app/models';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import CalendarCell from './CalendarCell';
import EventFooter from './EventFooter';
import Toolbar from './Toolbar';

import styles from './Calendar.css';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

type Props = {
  weekOffset: number,
  date: moment$Moment,
  icalToken: IcalToken,
  actionGrant: ActionGrant,
};

function pathForPrevMonth(date: moment$Moment) {
  const newDate = date.clone().subtract(1, 'months');
  return `${newDate.year()}/${newDate.month() + 1}`;
}

function pathForNextMonth(date: moment$Moment) {
  const newDate = date.clone().add(1, 'months');
  return `${newDate.year()}/${newDate.month() + 1}`;
}

export default class Calendar extends Component<Props> {
  static defaultProps = {
    weekOffset: 0,
  };

  render() {
    const { actionGrant, date, icalToken } = this.props;

    return (
      <div className={styles.root}>
        <Helmet title="Kalender" />
        <Toolbar actionGrant={actionGrant} />

        <h2 className={styles.header}>
          <Link to={`/events/calendar/${pathForPrevMonth(date)}`}>«</Link>
          <span>{date.format('MMMM YYYY')}</span>
          <Link to={`/events/calendar/${pathForNextMonth(date)}`}>»</Link>
        </h2>

        <div className={styles.grid}>
          {WEEKDAYS.map((d) => (
            <div key={d} className={styles.headingItem}>
              {d}
            </div>
          ))}
          {createMonthlyCalendar(date, this.props.weekOffset).map(
            (dateProps, i) => (
              <CalendarCell key={i} {...(dateProps: Object)} />
            )
          )}
        </div>
        <EventFooter icalToken={icalToken} />
      </div>
    );
  }
}
