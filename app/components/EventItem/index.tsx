import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
<<<<<<< HEAD
import type { Event, EventTime } from 'app/models';
import { colorForEvent } from 'app/routes/events/utils';
import { eventStatus, eventAttendance } from 'app/utils/eventStatus';
=======
import Tooltip from 'app/components/Tooltip';
import type { Event, EventTimeType } from 'app/models';
import { colorForEvent } from 'app/routes/events/utils';
import { EVENTFIELDS } from 'app/utils/constants';
import {
  eventStatus,
  eventAttendance,
  eventAttendanceAbsolute,
} from 'app/utils/eventStatus';
>>>>>>> 164a29ac (Implement new event components for upcoming events on profile page.)
import styles from './styles.css';
import type { ReactNode } from 'react';

type AttendanceProps = {
  event: Event;
};

export type EventStyle = 'default' | 'extra-compact' | 'compact';

type statusIconProps = {
  icon: string;
  color: string;
  tooltip: string;
};

const statusIconDict = {
  'Du er påmeldt': {
    icon: 'checkmark-circle-outline',
    color: '#0eb30e',
    tooltip: 'Du er påmeldt',
  },
  'Ingen påmeldingsrett': {
    icon: 'timer-outline',
    color: '#fc9003',
    tooltip: 'Du er på ventelisten',
  },
};

const Attendance = ({ event }: AttendanceProps) => {
  const attendance = eventAttendanceAbsolute(event);
  return (
    attendance && (
      <Pill
        style={{
          marginLeft: '5px',
          marginBottom: '5px',
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

<<<<<<< HEAD
const TimeStamp = ({ event, loggedIn }: TimeStampProps) => {
  const registration = eventStatus(event, loggedIn, true);
=======
const TimeStamp = ({ event, field, loggedIn }: TimeStampProps) => {
>>>>>>> 164a29ac (Implement new event components for upcoming events on profile page.)
  const hasStarted = moment().isAfter(event.startTime);
  const startedStatus = hasStarted ? 'Startet' : 'Starter';
  return (
    <div className={styles.eventTime} style={{ alignItems: 'center' }}>
      <Flex>
        <Icon
          name="calendar-number-outline"
          size={20}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />
        <Time time={event.startTime} format="ll" />
      </Flex>
      <Flex>
        <Icon
          name="time-outline"
          size={20}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />
        <Time time={event.startTime} format="HH:mm" />
      </Flex>
    </div>
  );
};

//TODO: Create icon with tooltip as registration / eventStatus
const RegistrationIcon = ({ event, field, loggedIn }: TimeStampProps) => {
  const registration = eventStatus(event, loggedIn, true);
  const iconStyle = statusIconDict.hasOwnProperty(registration)
    ? statusIconDict[registration]
    : {
        Feil: {
          icon: 'help-outline',
          color: 'blue',
          tooltip: 'Det har oppstått en feil',
        },
      };
  return (
    <Pill style={{ marginLeft: '5px', color: 'black', whiteSpace: 'nowrap' }}>
      <Flex justifyContent="center">
        <Tooltip content={iconStyle.tooltip}>
          <Icon
            name={iconStyle.icon}
            size={25}
            style={{ cursor: 'pointer', color: iconStyle.color }}
          />
        </Tooltip>
      </Flex>
    </Pill>
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
    case 'compact':
      return (
        <div
          style={{ borderColor: colorForEvent(event.eventType) }}
          className={styles.eventItemCompact}
        >
          <div className={styles.eventItemRow}>
            <Link to={`/events/${event.id}`}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>
            </Link>
          </div>
          <div className={styles.eventItemRow}>
            <div className={styles.eventItemColumn} style={{ width: '50%' }}>
              <Flex className={styles.companyLogo}>
                {event.cover && (
                  <Image
                    src={event.cover}
                    placeholder={event.coverPlaceholder}
                  />
                )}
              </Flex>
              <TimeStamp event={event} field={field} loggedIn={loggedIn} />
              {showTags && (
                <Flex wrap>
                  {event.tags.map((tag, index) => (
                    <Tag key={index} tag={tag} />
                  ))}
                </Flex>
              )}
            </div>
            <div
              className={styles.eventItemColumn}
              style={{
                width: '25%',
              }}
            >
              <Attendance
                registrationCount={event.registrationCount}
                totalCapacity={event.totalCapacity}
                event={event}
              />

              <RegistrationIcon
                event={event}
                field={field}
                loggedIn={loggedIn}
              />
            </div>
          </div>
        </div>
      );
    case 'default':
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
