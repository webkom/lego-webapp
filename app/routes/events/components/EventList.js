// @flow

import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import moment from 'moment-timezone';
import Time from 'app/components/Time';
import Pill from 'app/components/Pill';
import { Image } from 'app/components/Image';
import Tag from 'app/components/Tags/Tag';
import Button from 'app/components/Button';
import Toolbar from './Toolbar';
import { colorForEvent } from '../utils';
import styles from './EventList.css';
import EventFooter from './EventFooter';
import { Flex } from 'app/components/Layout';
import EmptyState from 'app/components/EmptyState';
import { isEmpty } from 'lodash';

// Kinda works
function groupEvents(events) {
  const now = moment();
  const nextWeek = now.clone().add(1, 'week');

  const groupers = {
    currentWeek: event =>
      event.startTime.isBetween(
        now.clone().startOf('day'),
        now.clone().endOf('week')
      ),
    nextWeek: event => event.startTime.isSame(nextWeek, 'week'),
    later: event => event.startTime.isAfter(nextWeek)
  };

  return events.reduce((result, event) => {
    for (const groupName in groupers) {
      if (groupers[groupName](event)) {
        result[groupName] = (result[groupName] || []).concat(event);
        return result;
      }
    }

    return result;
  }, {});
}

type AttendanceProps = {
  registrationCount: number,
  totalCapacity: number,
  style: any
};

function Attendance({
  registrationCount,
  totalCapacity,
  style
}: AttendanceProps) {
  // @todo choose pill color based on capacity
  return (
    <Pill style={{ ...style, whiteSpace: 'nowrap' }}>
      {`${registrationCount} / ${totalCapacity}`}
    </Pill>
  );
}

export function EventItem({ event }: any) {
  return (
    <div
      style={{ borderColor: colorForEvent(event.eventType) }}
      className={styles.eventItem}
    >
      <div>
        <Link to={`/events/${event.id}`}>
          <h3 className={styles.eventItemTitle}>{event.title}</h3>
          <Attendance
            registrationCount={event.registrationCount}
            totalCapacity={event.totalCapacity}
            style={{ marginLeft: '5px', color: 'black' }}
          />
        </Link>

        <div className={styles.eventTime}>
          <Time time={event.startTime} format="ll HH:mm" />
          {` • ${event.location}`}
        </div>

        <Flex wrap className={styles.tagList}>
          {event.tags.map((tag, index) => <Tag key={index} tag={tag} small />)}
        </Flex>
      </div>

      <div className={styles.companyLogo}>
        <Image src={event.cover} />
      </div>
    </div>
  );
}

type EventListGroupProps = {
  name: string,
  events: Array</*TODO: Event */ any>
};

function EventListGroup({ name, events = [] }: EventListGroupProps) {
  return isEmpty(events) ? null : (
    <div className={styles.eventGroup}>
      <h2 className={styles.heading}>{name}</h2>
      {events.map((event, i) => <EventItem key={i} event={event} />)}
    </div>
  );
}

type EventListProps = {
  events: Array<any>,
  actionGrant: /* TODO: ActionGrant */ any,
  icalToken: /* TODO: IcalToken */ string,
  showFetchMore: boolean,
  fetchMore: () => Promise<*>
};

const EventList = (props: EventListProps) => {
  const events = groupEvents(props.events);
  const { icalToken, showFetchMore, fetchMore } = props;
  return (
    <div className={styles.root}>
      <Helmet title="Arrangementer" />
      <Toolbar actionGrant={props.actionGrant} />
      <EventListGroup name="Denne uken" events={events.currentWeek} />

      <EventListGroup name="Neste uke" events={events.nextWeek} />

      <EventListGroup name="Senere" events={events.later} />

      {isEmpty(props.events) && (
        <EmptyState icon="book-outline" size={40}>
          <h2 className={styles.noEvents}>Ingen kommende arrangementer</h2>
        </EmptyState>
      )}
      {showFetchMore && <Button onClick={fetchMore}>Last inn mer</Button>}
      <div className={styles.bottomBorder} />
      <EventFooter icalToken={icalToken} />
    </div>
  );
};

export default EventList;
