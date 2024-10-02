import { Flex, Icon, Image } from '@webkom/lego-bricks';
import {
  AlarmClock,
  Calendar,
  CalendarClock,
  Clock,
  CircleAlert,
  CircleCheckBig,
  Timer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { colorForEventType } from 'app/routes/events/utils';
import { eventAttendanceAbsolute } from 'app/utils/eventStatus';
import styles from './styles.css';
import type { ListEvent } from 'app/store/models/Event';
import type { ReactNode } from 'react';

export type EventStyle = 'default' | 'extra-compact' | 'compact';

type statusIconProps = {
  status: string;
  icon: ReactNode;
  color: string;
  tooltip: string;
};

const eventStatusObject = (event: ListEvent): statusIconProps => {
  const { isAdmitted, eventStatusType } = event;

  switch (eventStatusType) {
    case 'NORMAL':
    case 'INFINITE':
      if (isAdmitted) {
        return {
          status: 'Admitted',
          icon: <CircleCheckBig />,
          color: 'var(--success-color)',
          tooltip: 'Du er påmeldt',
        } as statusIconProps;
      }
      return {
        status: 'Waitlist',
        icon: <Timer />,
        color: 'var(--color-orange-6)',
        tooltip: 'Du er på ventelisten',
      } as statusIconProps;
    default:
      return {
        status: 'Error',
        icon: <CircleAlert />,
        color: 'var(--danger-color)',
        tooltip: 'Det har oppstått en feil',
      } as statusIconProps;
  }
};

const Attendance = ({ event }) => {
  const attendance = eventAttendanceAbsolute(event);
  return !!attendance && <Pill>{attendance}</Pill>;
};

type TimeStampProps = {
  event: ListEvent;
};

const TimeStamp = ({ event }: TimeStampProps) => {
  return (
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Calendar />} size={18} />
        <Time time={event.startTime} format="ll" />
      </Flex>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Clock />} size={18} />
        <Time time={event.startTime} format="HH:mm" />
      </Flex>
    </div>
  );
};

const TimeStartAndRegistration = ({ event }: TimeStampProps) => {
  return (
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<CalendarClock />} size={18} />
        <Time time={event.startTime} format="ll HH:mm" />
      </Flex>

      {!!event.activationTime && (
        <Flex alignItems="center" gap="var(--spacing-sm)">
          <Tooltip content="Påmelding åpner">
            <Icon name="alarm-outline" size={20} />
            <Icon iconNode={<AlarmClock />} size={18} />
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
    <Tooltip content={iconStyle.tooltip}>
      <Icon
        iconNode={iconStyle.icon}
        size={18}
        style={{ color: iconStyle.color }}
      />
    </Tooltip>
  );
};

type EventItemProps = {
  event: ListEvent;
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
        <Link
          to={`/events/${event.slug}`}
          style={{
            borderColor: colorForEventType(event.eventType),
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
                alt="Forsidebilde"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </Link>
      );
    case 'compact':
      return (
        <Link
          to={`/events/${event.slug}`}
          style={{ borderColor: colorForEventType(event.eventType) }}
          className={styles.eventItemCompact}
        >
          {/* <Link to={`/events/${event.slug}`}> */}
          <h3 className={styles.eventItemTitle}>{event.title}</h3>
          {/* </Link> */}
          <Flex justifyContent="space-between">
            <Flex width="72%">
              <Flex className={styles.companyLogoCompact}>
                {event.cover && (
                  <Link to={`/events/${event.slug}`}>
                    <Image
                      src={event.cover}
                      placeholder={event.coverPlaceholder}
                      alt={`Forsidebildet til ${event.title}`}
                    />
                  </Link>
                )}
              </Flex>
            </Flex>
            <Flex justifyContent="flex-start" column width="25%">
              <Flex wrap alignItems="center" gap="var(--spacing-sm)">
                <RegistrationIcon event={event} />
                <Attendance event={event} />
              </Flex>

              <TimeStamp event={event} />
            </Flex>
          </Flex>
          {showTags && (
            <Flex wrap>
              {event.tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </Flex>
          )}
        </Link>
      );
    case 'default':
    default:
      return (
        <Link
          to={`/events/${event.slug}`}
          style={{
            borderColor: colorForEventType(event.eventType),
          }}
          className={styles.eventItem}
        >
          <div>
            <h3 className={styles.eventItemTitle}>{event.title}</h3>
            {event.totalCapacity > 0 && <Attendance event={event} />}
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
                alt="Forsidebilde"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </Link>
      );
  }
};

export default EventItem;
