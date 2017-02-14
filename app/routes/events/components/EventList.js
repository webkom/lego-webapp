// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Time from 'app/components/Time';
import Pill from 'app/components/Pill';
import Image from 'app/components/Image';
import Toolbar from './Toolbar';
import colorForEvent from '../colorForEvent';
import styles from './EventList.css';

// Kinda works
function groupEvents(events) {
  const now = moment();
  const nextWeek = now.clone().add(1, 'week');

  const groupers = {
    currentWeek: (event) => event.startTime.isSame(now, 'week'),
    nextWeek: (event) => event.startTime.isSame(nextWeek, 'week'),
    later: (event) => event.startTime.isAfter(nextWeek)
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

function getAttendanceMessage({ registrationCount, totalCapacity }) {
  return `${registrationCount} / ${totalCapacity}`;
}

function EventItem({ event }) {
  const attendanceMessage = getAttendanceMessage(event);
  return (
    <div
      style={{ borderColor: colorForEvent(event.eventType) }}
      className={styles.eventItem}
    >
      <div>
        <Link to={`/events/${event.id}`}>
          <h3 className={styles.eventItemTitle}>
            {event.title}
            <Pill style={{ marginLeft: 10 }}>
              {attendanceMessage}
            </Pill>
          </h3>
        </Link>

        <div>
          <span>3 friends are going</span>
        </div>

        <div className={styles.eventTime}>
          <Time
            time={event.startTime}
            format='ll HH:mm'
          />
          {` • ${event.location}`}
        </div>
      </div>

      <div className={styles.companyLogo}>
        <Image src={event.cover} />
      </div>
    </div>
  );
}

function EventListGroup({ name, events = [] }) {
  return (
    <div className={styles.eventGroup}>
      <h2 className={styles.heading}>{name}</h2>
      {events.map((event, i) => (
        <EventItem
          key={i}
          event={event}
        />
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

        <EventListGroup
          name='Denne uken'
          events={events.currentWeek}
        />

        <EventListGroup
          name='Neste uke'
          events={events.nextWeek}
        />

        <EventListGroup
          name='Senere'
          events={events.later}
        />
      </div>
    );
  }
}

export default EventList;
