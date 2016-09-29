// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Time from 'app/components/Time';
import Pill from 'app/components/Pill';
import Toolbar from './Toolbar';
import colorForEvent from '../colorForEvent';
import { getImage } from 'app/utils';
import styles from './EventList.css';

// Kinda works
function groupEvents(events) {
  const now = moment().subtract(30, 'weeks');
  const nextWeek = now.clone().add(1, 'week');

  const groupers = {
    currentWeek: (event) => moment(event.startTime).isSame(now, 'week'),
    nextWeek: (event) => moment(event.startTime).isSame(nextWeek, 'week'),
    later: (event) => moment(event.startTime).isAfter(nextWeek)
  };

  return events.reduce((result, event) => {
    for (const groupName in groupers) {
      if (groupers[groupName](event)) {
        result[groupName] = (result[groupName] || []).concat([event]);
        return result;
      }
    }

    return result;
  }, {});
}

function getAttendanceMessage() {
  return '0 / 100';
}

function Events({ events = [] }) {
  const attendanceMessage = getAttendanceMessage();

  return (
    <div className={styles.eventGroup}>
      {events.map((event, i) => (
        <div
          key={i}
          style={{ borderColor: colorForEvent(event.eventType) }}
          className={styles.eventItem}
        >
          <div>
            <Link to={`/events/${event.id}`}>
              <h3 className={styles.eventItemTitle}>
                {event.title}
                <Pill style={{ marginLeft: 10 }}>{attendanceMessage}</Pill>
              </h3>
            </Link>
            <div><span>3 friends are going</span></div>
            <div className={styles.eventTime}>
              <Time time={event.startTime} format='ll HH:mm' />
            </div>
          </div>

          <div className={styles.companyLogo}>
            <img src={getImage(event.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

class EventList extends Component {
  render() {
    const events = groupEvents(this.props.events);
    return (
      <div className={styles.root}>
        <Toolbar />
        <h2 className={styles.heading}>Denne uken</h2>
        <Events events={events.currentWeek} />

        <h2 className={styles.heading}>Neste uke</h2>
        <Events events={events.nextWeek} />

        <h2 className={styles.heading}>Senere</h2>
        <Events events={events.later} />
      </div>
    );
  }
}

export default EventList;
