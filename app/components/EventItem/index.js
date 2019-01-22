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

type AttendanceProps = {
  registrationCount: number,
  totalCapacity: number
};

const Attendance = ({ registrationCount, totalCapacity }: AttendanceProps) => {
  return (
    <Pill style={{ marginLeft: '5px', color: 'black', whiteSpace: 'nowrap' }}>
      {`${registrationCount} / ${totalCapacity}`}
    </Pill>
  );
};

type EventItemProps = {
  event: Event,
  showTags?: boolean
};

const EventItem = ({ event, showTags = true }: EventItemProps) => {
  return (
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
            />
          )}
        </Link>

        <div className={styles.eventTime}>
          <Time time={event.startTime} format="ll HH:mm" />
          {` • ${event.location}`}
        </div>
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
};

export default EventItem;
