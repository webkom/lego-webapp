import { Flex, Icon } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { colorForEvent } from 'app/routes/events/utils';
import { eventAttendanceAbsolute } from 'app/utils/eventStatus';
import styles from './styles.css';
import type { Event } from 'app/models';
import type { ReactNode } from 'react';

export type EventStyle = 'default' | 'extra-compact' | 'compact';

type statusIconProps = {
  status: string;
  icon: string;
  color: string;
  tooltip: string;
};

const eventStatusObject = (event: Event): statusIconProps => {
  const { isAdmitted, eventStatusType } = event;

  switch (eventStatusType) {
    case 'NORMAL':
    case 'INFINITE':
      if (isAdmitted) {
        return {
          status: 'Admitted',
          icon: 'checkmark-circle-outline',
          color: 'var(--color-green-6)',
          tooltip: 'Du er påmeldt',
        } as statusIconProps;
      }
      return {
        status: 'Waitlist',
        icon: 'timer-outline',
        color: 'var(--color-orange-6)',
        tooltip: 'Du er på ventelisten',
      } as statusIconProps;
    default:
      return {
        status: 'Error',
        icon: 'help-outline',
        color: 'var(--danger-color)',
        tooltip: 'Det har oppstått en feil',
      } as statusIconProps;
  }
};

const Attendance = ({ event }) => {
  const attendance = eventAttendanceAbsolute(event);
  return (
    !!attendance && (
      <Pill
        style={{
          marginLeft: '5px',
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
};

const TimeStamp = ({ event }: TimeStampProps) => {
  return (
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap={10}>
        <Tooltip content={'Arrangementsdato'}>
          <Icon name="calendar-number-outline" size={20} />
        </Tooltip>
        <Time time={event.startTime} format="ll" />
      </Flex>
      <Flex alignItems="center" gap={10}>
        <Tooltip content={'Starttidspunkt'}>
          <Icon name="time-outline" size={20} />
        </Tooltip>
        <Time time={event.startTime} format="HH:mm" />
      </Flex>
    </div>
  );
};

const TimeStartAndRegistration = ({ event }: TimeStampProps) => {
  return (
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap={10}>
        <Tooltip content={'Arrangementstart'}>
          <Icon name="calendar-number-outline" size={20} />
        </Tooltip>
        <Time time={event.startTime} format="ll HH:mm" />
      </Flex>

      {!!event.activationTime && (
        <Flex alignItems="center" gap={10}>
          <Tooltip content={'Påmelding åpner'}>
            <Icon name="alarm-outline" size={20} />
          </Tooltip>
          <Time time={event.activationTime} format="ll HH:mm" />
        </Flex>
      )}
    </div>
  );
};

const RegistrationIcon = ({ event }: TimeStampProps) => {
  const iconStyle = eventStatusObject(event);
  return (
    <Flex justifyContent="center" alignItems="center">
      <Tooltip content={iconStyle.tooltip}>
        <Icon
          name={iconStyle.icon}
          size={23}
          style={{ color: iconStyle.color }}
        />
      </Tooltip>
    </Flex>
  );
};

type EventItemProps = {
  event: Event;
  showTags?: boolean;
  eventStyle?: EventStyle;
};

const EventItem = ({
  event,
  showTags = true,
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
            <Link to={`/events/${event.slug}`}>
              <h4 className={styles.eventItemTitle}>{event.title}</h4>
            </Link>
            <Time
              time={event.startTime}
              format="ll - HH:mm"
              className={styles.time}
            />
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
          <Flex width="100%">
            <Link to={`/events/${event.slug}`}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>
            </Link>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Flex width="72%">
              <Flex className={styles.companyLogoCompact}>
                {event.cover && (
                  <Link to={`/events/${event.slug}`}>
                    <Image
                      src={event.cover}
                      placeholder={event.coverPlaceholder}
                      alt={`Event cover image - ${event.title}`}
                    />
                  </Link>
                )}
              </Flex>
            </Flex>
            <Flex justifyContent="flex-start" column={true} width="25%">
              <Flex width="100%" justifyContent="flex-start">
                <RegistrationIcon event={event} />
                <Attendance event={event} />
              </Flex>

              <TimeStamp event={event} />
            </Flex>
          </Flex>
          {showTags && (
            <Flex wrap width="100%" justifyContent="flex-start">
              {event.tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </Flex>
          )}
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
            <Link to={`/events/${event.slug}`}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>
              {event.totalCapacity > 0 && <Attendance event={event} />}
            </Link>
            <TimeStartAndRegistration event={event} />
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
