// @flow

import React from 'react';
import styles from './styles.css';
import Pill from 'app/components/Pill';
import { colorForEvent } from 'app/routes/events/utils';
import { Link } from 'react-router';
import { Image } from 'app/components/Image';
import Time from 'app/components/Time';
import Tag from 'app/components/Tags/Tag';
import { Flex } from 'app/components/Layout';
import type { Event } from 'app/models';
import moment from 'moment-timezone';
import { EVENTFIELDS } from 'app/utils/constants';

type AttendanceProps = {
  registrationCount: number,
  totalCapacity: number,
  event: Event
};

const Attendance = ({
  registrationCount,
  totalCapacity,
  event
}: AttendanceProps) => {
  const future = moment().isBefore(event.activationTime);
  return (
    <Pill style={{ marginLeft: '5px', color: 'black', whiteSpace: 'nowrap' }}>
      {future
        ? `${totalCapacity} plasser`
        : `${registrationCount} / ${totalCapacity}`}
    </Pill>
  );
};

type TimeStampProps = {
  event: Event,
  field: string
};

const TimeStamp = ({ event, field }: TimeStampProps) => {
  const future = moment().isBefore(event.activationTime);

  const registration = future
    ? `Åpner ${moment(event.activationTime).format('ll HH:mm')}`
    : `Åpent`;

  return (
    <div className={styles.eventTime}>
      {registration}
      <br />
      Starter kl: <Time time={event.startTime} format="ll HH:mm" />
    </div>
  );
};

type EventItemProps = {
  event: Event,
  field?: 'activationTime' | 'startTime',
  showTags?: boolean
};

const EventItem = ({
  event,
  field = EVENTFIELDS.start,
  showTags = true
}: EventItemProps) => (
  <div
    style={{ borderColor: colorForEvent(event.eventType) }}
    className={styles.eventItem}
  >
    <div>
      <Link to={`/events/${event.id}`}>
        <h3 className={styles.eventItemTitle}>{event.title}</h3>
        {event.totalCapacity > 0 && (
          <Attendance
            registrationCount={event.registrationCount}
            totalCapacity={event.totalCapacity}
            event={event}
          />
        )}
      </Link>
      <TimeStamp event={event} field={field} />
      {showTags && (
        <Flex wrap>
          {event.tags.map((tag, index) => (
            <Tag key={index} tag={tag} small />
          ))}
        </Flex>
      )}
    </div>

    <div className={styles.companyLogo}>
      {event.cover && <Image src={event.cover} />}
    </div>
  </div>
);

export default EventItem;
