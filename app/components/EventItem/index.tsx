import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import type { Event, EventTime } from 'app/models';
import { colorForEvent } from 'app/routes/events/utils';
import { eventStatus, eventAttendance } from 'app/utils/eventStatus';
import styles from './styles.css';
import type { ReactNode } from 'react';

type AttendanceProps = {
  event: Event;
};
export type EventStyle = 'default' | 'extra-compact';

const Attendance = ({ event }: AttendanceProps) => {
  const attendance = eventAttendance(event);
  return (
    attendance && (
      <Pill
        style={{
          marginLeft: '5px',
          color: 'black',
          whiteSpace: 'nowrap',
        }}
      >
        {attendance}
      </Pill>
    )
  );
};

type TimeStampProps = {
  event: Event;
  loggedIn: boolean;
};

const TimeStamp = ({ event, loggedIn }: TimeStampProps) => {
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
  event: Event;
  field?: EventTime;
  showTags?: boolean;
  loggedIn: boolean;
  eventStyle?: EventStyle;
};

const EventItem = ({
  event,
  showTags = true,
  loggedIn = false,
  eventStyle,
}: EventItemProps): ReactNode => {
  switch (eventStyle) {
    case 'extra-compact':
      return (
        <div
          style={{
            borderColor: colorForEvent(event.eventType),
          }}
          className={styles.eventItem}
        >
          <div>
            <Link to={`/events/${event.id}`}>
              <h4 className={styles.eventItemTitle}>{event.title}</h4>
            </Link>
            <Time time={event.startTime} format="ll - HH:mm" />
          </div>
          <Flex className={styles.companyLogoExtraCompact}>
            {event.cover && (
              <Image
                alt="Event cover image"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </div>
      );

    default:
      return (
        <div
          style={{
            borderColor: colorForEvent(event.eventType),
          }}
          className={styles.eventItem}
        >
          <div>
            <Link to={`/events/${event.id}`}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>
              {event.totalCapacity > 0 && <Attendance event={event} />}
            </Link>
            <TimeStamp event={event} loggedIn={loggedIn} />
            {showTags && (
              <Flex wrap>
                {event.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </Flex>
            )}
          </div>

          <Flex className={styles.companyLogo}>
            {event.cover && (
              <Image
                alt="Event cover"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </div>
      );
  }
};

export default EventItem;
