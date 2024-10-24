import { Icon, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment, { type Moment } from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchEvents } from 'app/actions/EventActions';
import { useCurrentUser } from 'app/reducers/auth';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createMonthlyCalendar from 'app/utils/createMonthlyCalendar';
import styles from './Calendar.module.css';
import CalendarCell from './CalendarCell';
import EventFooter from './EventFooter';
import EventsTabs from './EventsTabs';

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const pathForPrevMonth = (date: Moment) => {
  const prevMonth = date.clone().subtract(1, 'months');
  return `${prevMonth.year()}/${prevMonth.month() + 1}`;
};

const pathForNextMonth = (date: Moment) => {
  const nextMonth = date.clone().add(1, 'months');
  return `${nextMonth.year()}/${nextMonth.month() + 1}`;
};

const getDate = (month?: string, year?: string) => {
  const validYear = year ? parseInt(year, 10) : moment().year();
  const validMonth = month ? parseInt(month, 10) - 1 : moment().month();

  return moment([validYear, validMonth]);
};

const Calendar = () => {
  const { month, year } = useParams<{ month: string; year: string }>();
  const date = getDate(month, year);

  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const currentUser = useCurrentUser();
  const icalToken = currentUser?.icalToken;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchCalendar',
    () => {
      if (date.isValid()) {
        const dateAfter = date.clone().startOf('month').startOf('week');
        const dateBefore = date.clone().endOf('month').endOf('week');
        const query = {
          date_after: dateAfter.format('YYYY-MM-DD'),
          date_before: dateBefore.format('YYYY-MM-DD'),
          page_size: 1000,
        };
        return dispatch(
          fetchEvents({
            query,
          }),
        );
      }
    },
    [month, year],
  );

  return (
    <Page
      title="Arrangementer"
      actionButtons={
        actionGrant?.includes('create') && (
          <LinkButton href="/events/create">Lag nytt</LinkButton>
        )
      }
      tabs={<EventsTabs />}
    >
      <Helmet title="Kalender" />

      <h2 className={styles.header}>
        <Icon
          name="arrow-back"
          to={`/events/calendar/${pathForPrevMonth(date)}`}
        />
        <span className={styles.headerDate}>{date.format('MMMM YYYY')}</span>
        <Icon
          name="arrow-forward"
          to={`/events/calendar/${pathForNextMonth(date)}`}
        />
      </h2>

      <div className={styles.grid}>
        {WEEKDAYS.map((day) => (
          <div key={day} className={styles.weekdayHeading}>
            {day}
          </div>
        ))}
        {createMonthlyCalendar(date).map((dateProps) => (
          <CalendarCell
            key={dateProps.day.format('DD/MM/YY')}
            day={dateProps.day}
            prevOrNextMonth={dateProps.prevOrNextMonth}
          />
        ))}
      </div>
      {icalToken && <EventFooter icalToken={icalToken} />}
    </Page>
  );
};

export default Calendar;
