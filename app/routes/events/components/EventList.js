// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Toolbar from './Toolbar';
import colorForEvent from '../colorForEvent';
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

function Events({ events = [] }) {
  return (
    <div className={styles.eventGroup}>
      {events.map((event, i) => (
        <div
          key={i}
          style={{ borderColor: colorForEvent(event.eventType) }}
          className={styles.eventItem}
        >
          <Link to={`/events/${event.id}`}>
            <h3 className={styles.eventItemTitle}>{event.title}</h3>
          </Link>
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
        <h2 className={styles.heading}>This week</h2>
        <Events events={events.currentWeek} />

        <h2 className={styles.heading}>Next Week</h2>
        <Events events={events.nextWeek} />

        <h2 className={styles.heading}>Later</h2>
        <Events events={events.later} />
      </div>
    );
  }
}

export default EventList;
