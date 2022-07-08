// @flow

import type { Node } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import type { Event, EventTimeType } from 'app/models';
import { colorForEvent } from 'app/routes/events/utils';
import { EVENTFIELDS } from 'app/utils/constants';
import { eventAttendance, eventStatus } from 'app/utils/eventStatus';

import styles from './styles.css';

type AttendanceProps = {
  event: Event,
};

const Attendance = ({ event }: AttendanceProps) => {
  const attendance = eventAttendance(event);
  return (
    attendance && (
      <Pill style={{ marginLeft: '5px', color: 'black', whiteSpace: 'nowrap' }}>
        {attendance}
      </Pill>
    )
  );
};

type TimeStampProps = {
  event: Event,
  field: EventTimeType,
  loggedIn: boolean,
};

const TimeStamp = ({ event, field, loggedIn }: TimeStampProps) => {
  const registration = eventStatus(event, loggedIn, true);
  const hasStarted = moment().isAfter(event.startTime);
  const startedStatus = hasStarted ? 'Startet' : 'Starter';
  return (
    <div className={styles.eventTime}>
      {registration && (
        <span>
          {registration}
          <br />
        </span>
      )}
      {startedStatus} <Time time={event.startTime} format="ll - HH:mm" />
    </div>
  );
};

type EventItemProps = {
  event: Event,
  field?: EventTimeType,
  showTags?: boolean,
  loggedIn: boolean,
};

const EventItem = ({
  event,
  field = EVENTFIELDS.start,
  showTags = true,
  loggedIn = false,
}: EventItemProps): Node => (
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
      <TimeStamp event={event} field={field} loggedIn={loggedIn} />
      {showTags && (
        <Flex wrap>
          {event.tags.map((tag, index) => (
            <Tag key={index} tag={tag} />
          ))}
        </Flex>
      )}
    </div>

    <div className={styles.companyLogo}>
      {event.cover && (
        <Image src={event.cover} placeholder={event.coverPlaceholder} />
      )}
    </div>
  </div>
);

export default EventItem;
