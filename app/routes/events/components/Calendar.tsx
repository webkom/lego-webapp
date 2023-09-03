import { Icon } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { ActionGrant, IcalToken } from 'app/models';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import styles from './Calendar.css';
import CalendarCell from './CalendarCell';
import EventFooter from './EventFooter';
import Toolbar from './Toolbar';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const pathForPrevMonth = (date: moment.Moment) => {
  const prevMonth = date.clone().subtract(1, 'months');
  return `${prevMonth.year()}/${prevMonth.month() + 1}`;
};

const pathForNextMonth = (date: moment.Moment) => {
  const nextMonth = date.clone().add(1, 'months');
  return `${nextMonth.year()}/${nextMonth.month() + 1}`;
};

type Props = {
  weekOffset: number;
  date: moment.Moment;
  icalToken: IcalToken;
  actionGrant: ActionGrant;
};

const Calendar = (props: Props) => {
  const { actionGrant, date, icalToken, weekOffset } = props;
  return (
    <div className={styles.root}>
      <Helmet title="Kalender" />
      <Toolbar actionGrant={actionGrant} />

      <h2 className={styles.header}>
        <Link to={`/events/calendar/${pathForPrevMonth(date)}`}>
          <Icon name="arrow-back" />
        </Link>
        <span>{date.format('MMMM YYYY')}</span>
        <Link to={`/events/calendar/${pathForNextMonth(date)}`}>
          <Icon name="arrow-forward" />
        </Link>
      </h2>

      <div className={styles.grid}>
        {WEEKDAYS.map((d) => (
          <div key={d} className={styles.weekdayHeading}>
            {d}
          </div>
        ))}
        {createMonthlyCalendar(date, weekOffset).map((dateProps) => (
          <CalendarCell
            key={dateProps.day.format('DD/MM/YY')}
            day={dateProps.day}
            prevOrNextMonth={dateProps.prevOrNextMonth}
          />
        ))}
      </div>
      <EventFooter icalToken={icalToken} />
    </div>
  );
};

export default Calendar;
